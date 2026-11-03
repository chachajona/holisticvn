// GH-58 operational CLI. Default and reconciliation modes never write remotely.
import { createClient } from "@sanity/client";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
  assertApprovedManifest,
  assertRestoreState,
  assertTarget,
  assertSnapshotHash,
  assertReceiptIdentity,
  assertTransactionState,
  assertVerifiedReceipt,
  planRollback,
  revisionsOf,
  sha256,
  SNAPSHOT_QUERY,
  snapshotParameters,
} from "./lib/treatment-restore.mjs";

function liveDeployment(target) {
  const result = JSON.parse(
    execFileSync(
      "vercel",
      ["api", `/v13/deployments/${new URL(target.domain).hostname}`, "--raw"],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 8 * 1024 * 1024,
      },
    ),
  );
  return {
    id: result.id,
    projectId: result.projectId,
    commit: result.meta?.githubCommitSha,
    target: result.target,
    readyState: result.readyState,
    aliases: result.alias ?? [],
  };
}

// Tests exercise the exact argv/files/preflight/receipt orchestration through
// controlled transports, a GROQ dataset and the installed SDK transaction API.
export async function runRestore(argv, dependencies = {}) {
  const {
    root = process.cwd(),
    env = process.env,
    makeClient = createClient,
    resolveDeployment = liveDeployment,
    output = console.log,
    transactionId = randomUUID,
  } = dependencies;
  const { values } = parseArgs({
    args: argv,
    options: {
      project: { type: "string" },
      dataset: { type: "string" },
      "vercel-project": { type: "string" },
      manifest: { type: "string", default: ".context/issue-58/target-manifest.json" },
      "manifest-sha256": { type: "string" },
      "snapshot-sha256": { type: "string" },
      apply: { type: "boolean", default: false },
      confirm: { type: "string" },
      rollback: { type: "string" },
      reconcile: { type: "string" },
    },
  });
  if (values.reconcile && (values.apply || values.rollback))
    throw new Error("Reconciliation is read-only; cannot combine with --apply/--rollback");
  const path = (name) => resolve(root, name);
  const readBytes = (name) => readFileSync(path(name));
  const read = (name) => JSON.parse(readBytes(name).toString("utf8"));
  const manifestBytes = readBytes(values.manifest);
  const manifestHash = sha256(manifestBytes);
  if (!values["manifest-sha256"] || values["manifest-sha256"] !== manifestHash)
    throw new Error("Explicit --manifest-sha256 must match approved manifest bytes");
  const manifest = JSON.parse(manifestBytes.toString("utf8"));
  const target = manifest.target;
  if (
    values.project !== target.sanityProject ||
    values.dataset !== target.dataset ||
    values["vercel-project"] !== target.vercelProject
  ) {
    throw new Error(
      "Explicit --project yjzexxml --dataset production --vercel-project holisticvn required",
    );
  }
  if (values.apply && values.confirm !== "yjzexxml/production")
    throw new Error("Applying requires --confirm yjzexxml/production");
  const snapshotPath = resolve(dirname(path(values.manifest)), manifest.before.snapshot);
  const snapshotHash = values["snapshot-sha256"];
  const beforeBytes = readFileSync(snapshotPath);
  assertSnapshotHash(beforeBytes, snapshotHash);
  const before = JSON.parse(beforeBytes.toString("utf8"));
  const token = env.SANITY_AUTH_TOKEN || env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_AUTH_TOKEN or SANITY_API_WRITE_TOKEN required");
  for (const [key, expected] of [
    ["NEXT_PUBLIC_SANITY_PROJECT_ID", target.sanityProject],
    ["NEXT_PUBLIC_SANITY_DATASET", target.dataset],
    ["SANITY_STUDIO_PROJECT_ID", target.sanityProject],
    ["SANITY_STUDIO_DATASET", target.dataset],
  ]) {
    if (env[key] !== expected) throw new Error(`Production environment mismatch: ${key}`);
  }
  const seed = read("scripts/seed/treatments.json");
  const seo = read("lib/treatment-seo.json");
  const links = read("scripts/seed/treatment-links.json");
  const preflightFiles = () => {
    if (sha256(readBytes(values.manifest)) !== manifestHash)
      throw new Error("Approved manifest changed during preflight");
    assertSnapshotHash(readFileSync(snapshotPath), snapshotHash);
    const sourceHashes = manifest.sources.map(({ path: name }) => ({
      path: name,
      sha256: sha256(readBytes(name)),
    }));
    assertApprovedManifest({ manifest, before, seed, seo, links, sourceHashes });
    return sourceHashes;
  };
  const sourceHashes = preflightFiles();
  const deploymentIdentity = async () => {
    const deployment = await resolveDeployment(target);
    assertTarget(target, deployment);
    return deployment;
  };
  const client = makeClient({
    projectId: values.project,
    dataset: values.dataset,
    token,
    apiVersion: "2025-01-01",
    useCdn: false,
    perspective: "raw",
  });
  const parameters = snapshotParameters({ seed, links, before });
  const snapshot = () => client.fetch(SNAPSHOT_QUERY, parameters);
  const deployment = await deploymentIdentity();
  const current = await snapshot();
  const identity = { manifestHash, snapshotHash };
  const loadVerified = (name) => {
    const receipt = read(name);
    const bytes = receipt.postApply
      ? readFileSync(resolve(dirname(path(name)), receipt.postApply))
      : Buffer.alloc(0);
    const postApply = assertVerifiedReceipt({
      receipt,
      ...identity,
      postApplyBytes: bytes,
      manifest,
      before,
    });
    return { receipt, postApply };
  };
  const save = (name, data) => {
    const bytes = Buffer.from(`${JSON.stringify(data, null, 2)}\n`);
    mkdirSync(dirname(path(name)), { recursive: true });
    writeFileSync(path(name), bytes, { flag: "wx", mode: 0o600 });
    return bytes;
  };
  const followUp = () =>
    output(
      "Follow-up required: send authenticated POST /api/revalidate, then verify all 11 treatment URLs, /services, /treatments and /sitemap.xml. Record automatic webhook delivery separately; no webhook configuration was changed.",
    );
  const persistVerified = (prefix, receipt, after) => {
    const postApplyBytes = save(`${prefix}-after.json`, after);
    const verified = {
      ...receipt,
      status: "verified",
      verified: true,
      postApply: `${basename(prefix)}-after.json`,
      postApplySha256: sha256(postApplyBytes),
      revisions: revisionsOf(after),
    };
    save(`${prefix}-verified.json`, verified);
    output(`Verified ${receipt.transactionId}; recovery receipt: ${prefix}-verified.json`);
    followUp();
    return verified;
  };
  if (values.reconcile) {
    const receipt = read(values.reconcile);
    assertReceiptIdentity({ receipt, ...identity });
    if (!["pending", "committed", "verified"].includes(receipt.status))
      throw new Error("Receipt is not reconcilable");
    assertTarget(target, receipt.deployment);
    if (receipt.status === "verified" && receipt.operation === "restore") {
      const { postApply } = loadVerified(values.reconcile);
      planRollback({ manifest, before, postApply, current }); // Equality only; never commit.
    }
    if (receipt.operation === "rollback") {
      if (
        !receipt.rollbackReceipt ||
        sha256(readBytes(receipt.rollbackReceipt)) !== receipt.rollbackReceiptSha256
      )
        throw new Error("Rollback origin receipt integrity mismatch");
      loadVerified(receipt.rollbackReceipt);
    }
    assertTransactionState({
      manifest,
      before,
      current,
      transactionId: receipt.transactionId,
      operation: receipt.operation,
    });
    preflightFiles();
    await deploymentIdentity();
    const prefix = `${values.reconcile.replace(/\.json$/, "")}-reconciled-${randomUUID()}`;
    const verified = persistVerified(prefix, receipt, current);
    output("Reconciled using reads only; no retry mutation was sent.");
    return { state: "complete", mutations: 0, receipt: verified };
  }
  const state = assertRestoreState({ manifest, before, current });
  let postApply;
  let originReceipt;
  let mutations;
  if (values.rollback) {
    ({ receipt: originReceipt, postApply } = loadVerified(values.rollback));
    mutations = planRollback({ manifest, before, postApply, current });
  } else mutations = state === "complete" ? [] : manifest.mutations;
  output(
    JSON.stringify({
      mode: values.apply ? (values.rollback ? "rollback" : "apply") : "dry-run",
      target: "yjzexxml/production",
      deployment,
      manifestSha256: manifestHash,
      snapshotSha256: snapshotHash,
      state,
      mutations: mutations.length,
      creates: mutations.filter((m) => m.create).length,
      patches: mutations.filter((m) => m.patch).length,
    }),
  );
  if (!mutations.length || !values.apply) return { state, mutations: mutations.length };

  // Guards protect changed pages and occupied create IDs. Reads detect other
  // changes; Sanity supplies no exclusive dataset lock.
  const intendedTransactionId = transactionId();
  const prefix = `.context/issue-58/${values.rollback ? "rollback" : "apply"}-${intendedTransactionId}`;
  save(`${prefix}-before.json`, current);
  save(`${prefix}-plan.json`, {
    manifestSha256: manifestHash,
    snapshotSha256: snapshotHash,
    deployment,
    sourceHashes,
    mutations,
  });
  await deploymentIdentity();
  preflightFiles();
  const latest = await snapshot();
  if (values.rollback) {
    const verified = loadVerified(values.rollback);
    if (verified.receipt.transactionId !== originReceipt.transactionId)
      throw new Error("Rollback origin changed during preflight");
    planRollback({ manifest, before, postApply: verified.postApply, current: latest });
  } else if (assertRestoreState({ manifest, before, current: latest }) !== "ready")
    throw new Error("State changed during preflight; no write performed");
  const receipt = {
    status: "pending",
    verified: false,
    operation: values.rollback ? "rollback" : "restore",
    observedAt: new Date().toISOString(),
    manifestSha256: manifestHash,
    snapshotSha256: snapshotHash,
    target: "yjzexxml/production",
    deployment,
    transactionId: intendedTransactionId,
    before: `${basename(prefix)}-before.json`,
    ...(values.rollback
      ? {
          rollbackReceipt: values.rollback,
          rollbackReceiptSha256: sha256(readBytes(values.rollback)),
        }
      : {}),
  };
  save(`${prefix}-pending.json`, receipt); // Durable identity before the first possible write.
  output(`Intended transaction ${intendedTransactionId}; pending receipt: ${prefix}-pending.json`);
  const transaction = client.transaction(mutations).transactionId(intendedTransactionId);
  let result;
  try {
    result = await transaction.commit({ visibility: "sync", returnDocuments: false });
  } catch (error) {
    throw new Error(
      `Commit outcome uncertain. Reconcile ${prefix}-pending.json with --reconcile; do not retry the write. ${error.message}`,
      { cause: error },
    );
  }
  if (result.transactionId !== intendedTransactionId)
    throw new Error(`Transaction response identity mismatch; reconcile ${prefix}-pending.json`);
  const committed = { ...receipt, status: "committed", results: result.results };
  save(`${prefix}-receipt.json`, committed);
  output(`Committed ${intendedTransactionId}; receipt: ${prefix}-receipt.json`);
  let after;
  try {
    after = await snapshot();
    assertTransactionState({
      manifest,
      before,
      current: after,
      transactionId: intendedTransactionId,
      operation: receipt.operation,
    });
  } catch (error) {
    throw new Error(
      `Post-commit verification failed. Reconcile ${prefix}-receipt.json; do not retry the write. ${error.message}`,
      { cause: error },
    );
  }
  return {
    state: "complete",
    mutations: mutations.length,
    receipt: persistVerified(prefix, committed, after),
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await runRestore(process.argv.slice(2));
}
