import { createClient, type ClientConfig, type Mutation as SanityMutation } from "@sanity/client";
import { evaluate, parse } from "groq-js";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
// @ts-expect-error operational ESM entry point has no type declarations
import { runRestore } from "../scripts/restore-treatments.mjs";
// @ts-expect-error operational ESM helper has no type declarations
import { planRestore, sha256, RESTORE_TARGET } from "../scripts/lib/treatment-restore.mjs";

type Ref = { _key: string; _type: string; _ref: string };
type Doc = {
  _id: string;
  _type: string;
  _rev?: string;
  slug?: { current: string };
  groups?: { _key: string; group: string; treatments?: Ref[] }[];
  [key: string]: unknown;
};
type Mutation = {
  create?: Doc;
  patch?: { id: string; ifRevisionID: string; set?: Record<string, unknown>; unset?: string[] };
  delete?: { id: string };
};
const temporary: string[] = [];
afterEach(() => {
  for (const root of temporary.splice(0)) rmSync(root, { recursive: true, force: true });
});

/** Creates an isolated checkout and controlled dataset with real GROQ and SDK serialization. */
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "treatment-restore-cli-"));
  temporary.push(root);
  const write = (path: string, value: unknown) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), `${JSON.stringify(value, null, 2)}\n`);
  };
  const read = (path: string) => JSON.parse(readFileSync(join(root, path), "utf8"));
  const seed = JSON.parse(readFileSync("scripts/seed/treatments.json", "utf8"));
  const seo = JSON.parse(readFileSync("lib/treatment-seo.json", "utf8"));
  const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8"));
  // UUID identities deliberately differ from seed IDs; drafts may have other types.
  const legacy = ["cupping", "cold-plunge", "infrared-heat"].map((slug, index) => ({
    _id: `00000000-0000-4000-8000-00000000000${index}`,
    _type: "treatment",
    _rev: `preserved-${index}`,
    slug: { current: slug },
    title: `Editorial ${slug}`,
    price: 777,
  }));
  const before: Doc[] = [
    ...legacy,
    ...Object.entries(links).map(([id, groups]) => ({
      _id: id,
      _type: id,
      _rev: `${id}-original`,
      title: "Preserve page fields",
      groups: Object.entries(groups as Record<string, string[]>).map(([group, slugs]) => ({
        _key: group,
        group,
        treatments: slugs.flatMap((slug) => {
          const existing = legacy.find((doc) => doc.slug.current === slug);
          return existing
            ? [{ _key: `editor-${slug}`, _type: "reference", _ref: existing._id }]
            : [];
        }),
      })),
    })),
  ];
  const sources = [
    ["scripts/seed/treatments.json", seed],
    ["scripts/seed/treatment-links.json", links],
    ["lib/treatment-seo.json", seo],
  ] as const;
  for (const [path, value] of sources) write(path, value);
  const manifestPath = ".context/issue-58/target-manifest.json";
  const beforePath = ".context/issue-58/production-before.json";
  write(beforePath, before);
  const target = {
    ...RESTORE_TARGET,
    deploymentId: "fixture-deployment",
    commit: "fixture-commit",
    domain: "https://www.holisticvn.com",
  };
  const manifest = {
    issue: 58,
    target,
    before: { snapshot: "production-before.json" },
    sources: sources.map(([path]) => ({ path, sha256: sha256(readFileSync(join(root, path))) })),
    ...planRestore({ seed, seo, links, documents: before }),
  };
  write(manifestPath, manifest);
  const manifestHash = sha256(readFileSync(join(root, manifestPath)));
  const snapshotHash = sha256(readFileSync(join(root, beforePath)));
  const deployment = {
    id: target.deploymentId,
    projectId: target.vercelProjectId,
    commit: target.commit,
    target: "production",
    readyState: "READY",
    aliases: ["www.holisticvn.com"],
  };
  const state = {
    dataset: structuredClone(before),
    commits: 0,
    reads: 0,
    deployments: 0,
    responseLoss: false,
    failedRead: false,
    staleRead: false,
    commitNoWrite: false,
    onDeployment: (_count: number) => {
      void _count;
    },
    onRead: (_count: number) => {
      void _count;
    },
    transactionIds: [] as string[],
    queries: [] as string[],
    configs: [] as ClientConfig[],
    output: [] as string[],
  };
  const receipts = (suffix: string) =>
    readdirSync(join(root, ".context/issue-58"))
      .filter((name) => name.endsWith(suffix))
      .map((name) => `.context/issue-58/${name}`);
  const dependencies = {
    root,
    env: {
      SANITY_AUTH_TOKEN: "fixture-only",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "yjzexxml",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      SANITY_STUDIO_PROJECT_ID: "yjzexxml",
      SANITY_STUDIO_DATASET: "production",
    },
    transactionId: () => `fixture-transaction-${state.commits + 1}`,
    output: (message: string) => state.output.push(message),
    resolveDeployment: () => {
      state.onDeployment(++state.deployments);
      return deployment;
    },
    makeClient: (config: ClientConfig) => {
      state.configs.push(config);
      const sdk = createClient(config);
      return {
        fetch: async (query: string, params: Record<string, unknown>) => {
          state.queries.push(query);
          state.onRead(++state.reads);
          if (state.failedRead && state.reads === 3) throw new Error("Controlled read failure");
          // Execute the actual CLI query, not a test-owned approximation of it.
          const dataset = state.staleRead && state.reads === 3 ? before : state.dataset;
          const result = await evaluate(parse(query), { dataset, params });
          return result.get();
        },
        transaction: (mutations: SanityMutation[]) => {
          const transaction = sdk.transaction(mutations);
          const commit = async () => {
            const id = transaction.transactionId()!;
            const pending = read(receipts("-pending.json").at(-1)!);
            expect(pending.transactionId).toBe(id); // Durable before remote commit.
            expect(pending.status).toBe("pending");
            expect(pending.snapshotSha256).toBe(sha256(readFileSync(join(root, beforePath))));
            state.commits++;
            state.transactionIds.push(id);
            const next = structuredClone(state.dataset);
            for (const mutation of transaction.serialize() as Mutation[]) {
              if (mutation.create) {
                if (next.some((doc) => doc._id === mutation.create!._id))
                  throw new Error("Occupied ID");
                next.push({
                  ...mutation.create,
                  _rev: id,
                  _createdAt: "fixture-created",
                  _updatedAt: "fixture-updated",
                });
              } else if (mutation.patch) {
                const patch = mutation.patch;
                const doc = next.find((item) => item._id === patch.id)!;
                if (!doc || doc._rev !== patch.ifRevisionID) throw new Error("Revision conflict");
                for (const [field, value] of Object.entries(patch.set ?? {})) {
                  const key = /^groups\[_key=="([^"]+)"\]\.treatments$/.exec(field)?.[1];
                  if (key)
                    doc.groups!.find((group) => group._key === key)!.treatments = structuredClone(
                      value,
                    ) as Ref[];
                  else doc[field] = value;
                }
                for (const field of patch.unset ?? []) {
                  const key = /^groups\[_key=="([^"]+)"\]\.treatments$/.exec(field)?.[1];
                  if (key) delete doc.groups!.find((group) => group._key === key)!.treatments;
                  else delete doc[field];
                }
                doc._rev = id;
                doc._updatedAt = "fixture-updated";
              } else if (mutation.delete)
                next.splice(
                  next.findIndex((doc) => doc._id === mutation.delete!.id),
                  1,
                );
            }
            if (!state.commitNoWrite) state.dataset = next;
            if (state.responseLoss) throw new Error("Controlled lost commit response");
            return { transactionId: id, results: [] };
          };
          const controlled = {
            commit,
            transactionId: (id: string) => {
              transaction.transactionId(id);
              return controlled;
            },
          };
          return controlled;
        },
      };
    },
  };
  const args = [
    "--project",
    "yjzexxml",
    "--dataset",
    "production",
    "--vercel-project",
    "holisticvn",
    "--manifest-sha256",
    manifestHash,
    "--snapshot-sha256",
    snapshotHash,
  ];
  const run = (extra: string[] = []) => runRestore([...args, ...extra], dependencies);
  const apply = () => run(["--apply", "--confirm", "yjzexxml/production"]);
  return {
    root,
    write,
    read,
    manifest,
    before,
    state,
    args,
    dependencies,
    run,
    apply,
    receipts,
    beforePath,
    manifestPath,
    deployment,
  };
}

describe("actual restoration CLI orchestration with controlled GROQ/SDK transport", () => {
  it("defaults to no writes and uses raw uncached production query perspective", async () => {
    const f = fixture();
    expect(await f.run()).toEqual({ state: "ready", mutations: 10 });
    expect(f.state.commits).toBe(0);
    expect(f.state.configs[0]).toMatchObject({
      perspective: "raw",
      useCdn: false,
      projectId: "yjzexxml",
      dataset: "production",
    });
    expect(f.state.queries).toHaveLength(1);
  });

  it.each([{ confirm: [] }, { confirm: ["--confirm", "yjzexxml/staging"] }])(
    "rejects absent/wrong confirmation without writes",
    async ({ confirm }) => {
      const f = fixture();
      await expect(f.run(["--apply", ...confirm])).rejects.toThrow(/--confirm/);
      expect(f.state.commits).toBe(0);
      expect(f.state.reads).toBe(0);
    },
  );

  it("requires the reviewed snapshot hash even for a dry run", async () => {
    const f = fixture();
    await expect(runRestore(f.args.slice(0, -2), f.dependencies)).rejects.toThrow(/snapshot hash/);
    await expect(f.run(["--snapshot-sha256", "wrong"])).rejects.toThrow(/snapshot hash/);
    expect(f.state.commits).toBe(0);
  });

  it.each(["content", "revision"])(
    "binds preserved %s to original reviewed snapshot bytes",
    async (field) => {
      const f = fixture();
      const changed = structuredClone(f.before);
      if (field === "content") changed[0].price = 888;
      else changed[0]._rev = "later-revision";
      f.write(f.beforePath, changed);
      f.state.dataset = changed;
      await expect(f.apply()).rejects.toThrow(/snapshot hash/);
      expect(f.state.commits).toBe(0);
    },
  );

  it.each(["snapshot", "source", "manifest", "dataset", "deployment"])(
    "rejects final preflight %s conflict",
    async (kind) => {
      const f = fixture();
      f.state.onDeployment = (count) => {
        if (count !== 2) return;
        if (kind === "snapshot") {
          const changed = structuredClone(f.before);
          changed[0].price = 999;
          f.write(f.beforePath, changed);
        }
        if (kind === "source") f.write("lib/treatment-seo.json", {});
        if (kind === "manifest") f.write(f.manifestPath, { ...f.manifest, issue: 59 });
        if (kind === "dataset") f.state.dataset[0]._rev = "concurrent-edit";
        if (kind === "deployment") f.deployment.commit = "new-commit";
      };
      await expect(f.apply()).rejects.toThrow();
      expect(f.state.commits).toBe(0);
      expect(f.receipts("-pending.json")).toEqual([]);
    },
  );

  it.each(["draft", "release", "seed-draft", "occupied", "preserved-type"])(
    "actual query catches %s even under another type",
    async (kind) => {
      const f = fixture();
      const preserved = f.before[0]._id;
      if (kind === "preserved-type") f.state.dataset[0]._type = "other";
      else
        f.state.dataset.push({
          _id:
            kind === "draft"
              ? `drafts.${preserved}`
              : kind === "release"
                ? `versions.release.${preserved}`
                : kind === "seed-draft"
                  ? "drafts.treatment-iastm"
                  : "treatment-iastm",
          _type: "other",
        });
      await expect(f.apply()).rejects.toThrow(/draft|release|changed/i);
      expect(f.state.commits).toBe(0);
    },
  );

  it("persists intended ID, verifies exact committed state and prints cache follow-up; repeat is no-op", async () => {
    const f = fixture();
    const result = await f.apply();
    expect(result.receipt).toMatchObject({
      verified: true,
      status: "verified",
      operation: "restore",
      transactionId: "fixture-transaction-1",
    });
    expect(result.receipt.postApplySha256).toBe(
      sha256(readFileSync(join(f.root, ".context/issue-58", result.receipt.postApply))),
    );
    expect(f.state.output.some((text) => text.includes("authenticated POST /api/revalidate"))).toBe(
      true,
    );
    expect(await f.apply()).toEqual({ state: "complete", mutations: 0 });
    expect(f.state.commits).toBe(1);
  });

  it("rejects an occupied seed ID in the reviewed snapshot even when its slug exists elsewhere", async () => {
    const f = fixture();
    const occupied: Doc = { _id: "treatment-cupping", _type: "other" };
    f.before.push(occupied);
    f.state.dataset.push(structuredClone(occupied));
    f.write(f.beforePath, f.before);
    f.args[f.args.indexOf("--snapshot-sha256") + 1] = sha256(
      readFileSync(join(f.root, f.beforePath)),
    );
    await expect(f.apply()).rejects.toThrow(/Occupied document ID/);
    expect(f.state.commits).toBe(0);
    expect(f.state.dataset).toEqual(f.before);
  });

  it.each(["lost-response", "failed-read", "unchanged-post-read"])(
    "recovers %s through read-only reconciliation",
    async (kind) => {
      const f = fixture();
      f.state.responseLoss = kind === "lost-response";
      f.state.failedRead = kind === "failed-read";
      f.state.staleRead = kind === "unchanged-post-read";
      await expect(f.apply()).rejects.toThrow(/Reconcile|reconcile/);
      expect(f.receipts("-verified.json")).toEqual([]);
      const receipt = f.receipts(kind === "lost-response" ? "-pending.json" : "-receipt.json")[0];
      const result = await f.run(["--reconcile", receipt]);
      expect(result.receipt.verified).toBe(true);
      expect(result.mutations).toBe(0);
      expect(f.state.commits).toBe(1);
      expect(result.receipt.revisions[f.before[0]._id]).toBe(f.before[0]._rev);
    },
  );

  it("never marks an unchanged post-read verified or retries an unconfirmed transaction", async () => {
    const f = fixture();
    f.state.commitNoWrite = true;
    await expect(f.apply()).rejects.toThrow(/not complete/);
    await expect(f.run(["--reconcile", f.receipts("-receipt.json")[0]])).rejects.toThrow(
      /not complete/,
    );
    expect(f.state.commits).toBe(1);
    expect(f.receipts("-verified.json")).toEqual([]);
  });

  it("rejects reconciliation after a later same-content revision and never refreshes rollback guards", async () => {
    const f = fixture();
    f.state.responseLoss = true;
    await expect(f.apply()).rejects.toThrow(/uncertain/);
    f.state.dataset.find((doc) => doc._id === "treatment-iastm")!._rev = "later-editor-revision";
    await expect(f.run(["--reconcile", f.receipts("-pending.json")[0]])).rejects.toThrow(
      /Original transaction revision/,
    );
    expect(f.state.commits).toBe(1);
    expect(f.receipts("-verified.json")).toEqual([]);
  });

  it.each(["unverified", "manifest", "snapshot", "revisions", "post-hash", "post-bytes"])(
    "rejects rollback receipt integrity problem %s",
    async (kind) => {
      const f = fixture();
      await f.apply();
      const name = f.receipts("-verified.json")[0];
      const receipt = f.read(name);
      if (kind === "unverified") receipt.verified = false;
      if (kind === "manifest") receipt.manifestSha256 = "wrong";
      if (kind === "snapshot") receipt.snapshotSha256 = "wrong";
      if (kind === "revisions") receipt.revisions["treatment-iastm"] = "edited";
      if (kind === "post-hash") receipt.postApplySha256 = "wrong";
      if (kind === "post-bytes") {
        const post = f.read(`.context/issue-58/${receipt.postApply}`);
        post[0]._rev = "tampered";
        f.write(`.context/issue-58/${receipt.postApply}`, post);
      }
      f.write(name, receipt);
      await expect(f.run(["--rollback", name])).rejects.toThrow(/identity|integrity|revisions/i);
      expect(f.state.commits).toBe(1);
    },
  );

  it("previews rollback read-only and recovers a controlled rollback response loss", async () => {
    const f = fixture();
    await f.apply();
    const origin = f.receipts("-verified.json")[0];
    expect((await f.run(["--rollback", origin])).mutations).toBe(18);
    expect(f.state.commits).toBe(1);
    f.state.responseLoss = true;
    await expect(
      f.run(["--rollback", origin, "--apply", "--confirm", "yjzexxml/production"]),
    ).rejects.toThrow(/uncertain/);
    const pending = f.receipts("-pending.json").find((path) => path.includes("rollback-"))!;
    expect((await f.run(["--reconcile", pending])).receipt.verified).toBe(true);
    expect(f.state.commits).toBe(2);
    expect(f.state.dataset).toHaveLength(f.before.length);
  });

  it.each(["absolute", "checkout-relative"])(
    "reconciles rollback after moving the checkout when the origin path was %s",
    async (kind) => {
      const f = fixture();
      await f.apply();
      const origin = f.receipts("-verified.json")[0];
      f.state.responseLoss = true;
      await expect(
        f.run([
          "--rollback",
          kind === "absolute" ? join(f.root, origin) : origin,
          "--apply",
          "--confirm",
          "yjzexxml/production",
        ]),
      ).rejects.toThrow(/uncertain/);
      const pending = f.receipts("-pending.json").find((path) => path.includes("rollback-"))!;
      const container = mkdtempSync(join(tmpdir(), "treatment-recovery-moved-"));
      temporary.push(container);
      const movedRoot = join(container, "checkout");
      renameSync(f.root, movedRoot);
      const result = await runRestore([...f.args, "--reconcile", join(movedRoot, pending)], {
        ...f.dependencies,
        root: movedRoot,
      });
      expect(result.receipt).toMatchObject({
        verified: true,
        operation: "rollback",
        transactionId: "fixture-transaction-2",
      });
      expect(result.mutations).toBe(0);
      expect(f.state.commits).toBe(2);
      expect(f.state.dataset).toHaveLength(f.before.length);
    },
  );

  it("prohibits reconciliation combined with any write flag", async () => {
    const f = fixture();
    await expect(f.run(["--reconcile", "unused", "--apply"])).rejects.toThrow(/read-only/);
    expect(f.state.commits).toBe(0);
  });

  it("aborts rollback after a later same-content edit without adopting its revision", async () => {
    const f = fixture();
    await f.apply();
    const receipt = f.receipts("-verified.json")[0];
    f.state.dataset.find((doc) => doc._id === "treatment-iastm")!._rev = "later-edit";
    await expect(
      f.run(["--rollback", receipt, "--apply", "--confirm", "yjzexxml/production"]),
    ).rejects.toThrow(/Later edits/);
    expect(f.read(receipt).revisions["treatment-iastm"]).toBe("fixture-transaction-1");
    expect(f.state.commits).toBe(1);
  });
});
