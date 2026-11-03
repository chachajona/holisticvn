// Missing-only restoration. Pure planning; deliberately independent of catalogue sync.
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";

export const RESTORE_TARGET = Object.freeze({
  sanityProject: "yjzexxml",
  dataset: "production",
  vercelProject: "holisticvn",
  vercelProjectId: "prj_c7KdwuEk4uuqxIzAd4l8UQETqK5A",
});

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
export const SNAPSHOT_QUERY = `*[_type in ["treatment", "methodsPage", "servicesPage"] ||
  _id in $ids || _id in $draftIds ||
  (_id in path("versions.**") && string::split(_id, ".")[2] in $ids)]`;
const SEED_FIELDS = new Set([
  "_id",
  "_type",
  "title",
  "englishTitle",
  "slug",
  "shortDescription",
  "description",
  "price",
  "requiresCertifiedPractitioner",
  "faqs",
]);
const fail = (message) => {
  throw new Error(message);
};
const equal = (actual, expected, message) => {
  if (!isDeepStrictEqual(actual, expected)) fail(message);
};
const sorted = (documents) => [...documents].sort((a, b) => a._id.localeCompare(b._id));
const content = (document) =>
  Object.fromEntries(
    Object.entries(document).filter(([key]) => !["_rev", "_createdAt", "_updatedAt"].includes(key)),
  );

export function assertTarget(target, deployment) {
  for (const [key, value] of Object.entries(RESTORE_TARGET)) {
    if (target[key] !== value) fail(`Unapproved target: ${key}`);
  }
  if (
    deployment.id !== target.deploymentId ||
    deployment.projectId !== target.vercelProjectId ||
    deployment.commit !== target.commit ||
    deployment.target !== "production" ||
    deployment.readyState !== "READY" ||
    !deployment.aliases?.includes(new URL(target.domain).hostname)
  ) {
    fail("Production deployment identity changed; regenerate the plan");
  }
}

/** Full raw scoped documents, including drafts/releases and any occupied seed IDs. */
export function planRestore({ seed, seo, links, documents }) {
  if (documents.some((doc) => /^(drafts|versions)\./.test(doc._id))) {
    fail("Open draft or release conflicts with restoration");
  }
  const byId = new Map();
  const bySlug = new Map();
  for (const doc of documents) {
    if (byId.has(doc._id)) fail(`Duplicate document ID: ${doc._id}`);
    byId.set(doc._id, doc);
    if (doc._type !== "treatment") continue;
    const slug = doc.slug?.current;
    if (!slug || bySlug.has(slug)) fail(`Missing or duplicate treatment slug: ${slug}`);
    bySlug.set(slug, doc);
  }
  const mutations = [];
  const changes = [];
  const rollback = [];
  const idBySlug = new Map();
  const seedIds = new Set();
  for (const doc of seed) {
    const slug = doc.slug?.current;
    if (!slug || idBySlug.has(slug) || seedIds.has(doc._id)) fail("Duplicate seed identity");
    if (doc._type !== "treatment" || Object.keys(doc).some((key) => !SEED_FIELDS.has(key))) {
      fail(`Unapproved seed fields: ${slug}`);
    }
    seedIds.add(doc._id);
    const existing = bySlug.get(slug);
    if (existing) {
      idBySlug.set(slug, existing._id);
      continue;
    }
    if (byId.has(doc._id)) fail(`Occupied document ID: ${doc._id}`);
    if (!seo[slug]?.title || !seo[slug]?.description) fail(`Missing reviewed SEO: ${slug}`);
    const create = {
      ...doc,
      seo: { _type: "seo", title: seo[slug].title, description: seo[slug].description },
    };
    mutations.push({ create });
    changes.push({ id: doc._id, action: "create", slug, fields: Object.keys(create) });
    rollback.push({ id: doc._id, action: "delete-only-if-post-apply-revision-unchanged" });
    idBySlug.set(slug, doc._id);
  }
  for (const [pageId, groups] of Object.entries(links)) {
    const page = byId.get(pageId);
    if (!page || page._type !== pageId || !page._rev || !Array.isArray(page.groups)) {
      fail(`Missing or invalid page: ${pageId}`);
    }
    const keys = page.groups.map((group) => group._key);
    if (new Set(keys).size !== keys.length) fail(`Duplicate group key: ${pageId}`);
    const set = {};
    const undo = {};
    const unset = [];
    for (const [groupName, slugs] of Object.entries(groups)) {
      const found = page.groups.filter((group) => group.group === groupName);
      if (found.length !== 1) fail(`Missing or duplicate group: ${pageId}.${groupName}`);
      const group = found[0];
      if (!/^[A-Za-z0-9_-]+$/.test(group._key ?? "")) fail(`Unsafe group key: ${pageId}`);
      if (new Set(slugs).size !== slugs.length || slugs.some((slug) => !idBySlug.has(slug))) {
        fail(`Invalid approved slugs: ${pageId}.${groupName}`);
      }
      const refs = group.treatments ?? [];
      if (!Array.isArray(refs)) fail(`Invalid reference array: ${pageId}.${groupName}`);
      const expectedIds = new Set(slugs.map((slug) => idBySlug.get(slug)));
      const refIds = new Set();
      const refKeys = new Set();
      for (const ref of refs) {
        if (
          ref._type !== "reference" ||
          ref._weak ||
          !expectedIds.has(ref._ref) ||
          !/^[A-Za-z0-9_-]+$/.test(ref._key ?? "") ||
          refIds.has(ref._ref) ||
          refKeys.has(ref._key)
        ) {
          fail(`Unexpected or duplicate reference: ${pageId}.${groupName}`);
        }
        refIds.add(ref._ref);
        refKeys.add(ref._key);
      }
      const desired = slugs.map((slug) => {
        const id = idBySlug.get(slug);
        const existing = refs.find((ref) => ref._ref === id);
        if (existing) return existing; // Preserve complete existing reference objects and keys.
        if (refKeys.has(slug)) fail(`Reference key collision: ${pageId}.${groupName}.${slug}`);
        refKeys.add(slug);
        return { _key: slug, _type: "reference", _ref: id };
      });
      if (isDeepStrictEqual(refs, desired)) continue;
      const path = `groups[_key=="${group._key}"].treatments`;
      set[path] = desired;
      if (Object.hasOwn(group, "treatments")) undo[path] = group.treatments;
      else unset.push(path);
      changes.push({ id: pageId, action: "patch", field: path, before: refs, after: desired });
    }
    if (Object.keys(set).length) {
      mutations.push({ patch: { id: pageId, ifRevisionID: page._rev, set } });
      rollback.push({
        id: pageId,
        action: "patch-only-if-post-apply-revision-unchanged",
        set: undo,
        ...(unset.length ? { unset } : {}),
      });
    }
  }
  return { mutations, changes, rollback };
}

export function expectedAfter(before, manifest) {
  const docs = structuredClone(before);
  for (const mutation of manifest.mutations) {
    if (mutation.create) docs.push(structuredClone(mutation.create));
    else {
      const page = docs.find((doc) => doc._id === mutation.patch.id);
      for (const [path, refs] of Object.entries(mutation.patch.set)) {
        const key = /^groups\[_key=="([A-Za-z0-9_-]+)"\]\.treatments$/.exec(path)?.[1];
        const group = page?.groups.find((item) => item._key === key);
        if (!group) fail(`Unapproved patch path: ${path}`);
        group.treatments = structuredClone(refs);
      }
    }
  }
  return docs;
}

export function assertApprovedManifest({ manifest, before, seed, seo, links, sourceHashes }) {
  if (manifest.issue !== 58) fail("Unexpected manifest issue");
  equal(sourceHashes, manifest.sources, "Approved source hashes changed");
  const plan = planRestore({ seed, seo, links, documents: before });
  equal(plan.mutations, manifest.mutations, "Manifest differs from reviewed source and backup");
  equal(plan.rollback, manifest.rollback, "Manifest rollback differs from backup");
  return plan;
}

export function assertSnapshotHash(bytes, reviewedHash) {
  if (!reviewedHash || sha256(bytes) !== reviewedHash)
    fail("Reviewed before-snapshot hash changed");
}

export function snapshotParameters({ seed, links, before }) {
  const ids = [
    ...new Set([
      ...seed.map((doc) => doc._id),
      ...Object.keys(links),
      ...before.map((doc) => doc._id),
    ]),
  ];
  return { ids, draftIds: ids.map((id) => `drafts.${id}`) };
}

export const revisionsOf = (documents) =>
  Object.fromEntries(documents.map((doc) => [doc._id, doc._rev]));

export function assertTransactionState({
  manifest,
  before,
  current,
  transactionId,
  operation = "restore",
}) {
  if (!transactionId) fail("Missing intended transaction ID");
  if (operation === "restore") {
    if (assertRestoreState({ manifest, before, current }) !== "complete") {
      fail("Post-commit state is not complete");
    }
  } else if (operation === "rollback") {
    planRestoreIdentity(current);
    if (current.length !== before.length) fail("Rollback state is not complete");
    const pages = new Set(
      manifest.mutations.filter((item) => item.patch).map((item) => item.patch.id),
    );
    for (const doc of before) {
      const actual = current.find((item) => item._id === doc._id);
      if (!actual) fail(`Rollback document missing: ${doc._id}`);
      equal(
        pages.has(doc._id) ? content(actual) : actual,
        pages.has(doc._id) ? content(doc) : doc,
        `Rollback content changed: ${doc._id}`,
      );
    }
  } else fail("Unknown receipt operation");
  for (const mutation of manifest.mutations) {
    const id = mutation.create?._id ?? mutation.patch.id;
    if (operation === "rollback" && mutation.create) continue;
    if (current.find((doc) => doc._id === id)?._rev !== transactionId) {
      fail(`Original transaction revision no longer matches: ${id}`);
    }
  }
}

export function assertReceiptIdentity({ receipt, manifestHash, snapshotHash }) {
  if (
    receipt.manifestSha256 !== manifestHash ||
    receipt.snapshotSha256 !== snapshotHash ||
    receipt.target !== "yjzexxml/production" ||
    !receipt.transactionId ||
    !["restore", "rollback"].includes(receipt.operation)
  )
    fail("Receipt identity mismatch");
}

export function assertVerifiedReceipt({
  receipt,
  manifestHash,
  snapshotHash,
  postApplyBytes,
  manifest,
  before,
}) {
  assertReceiptIdentity({ receipt, manifestHash, snapshotHash });
  if (
    receipt.verified !== true ||
    receipt.status !== "verified" ||
    receipt.operation !== "restore" ||
    !receipt.postApply ||
    !receipt.postApplySha256 ||
    sha256(postApplyBytes) !== receipt.postApplySha256
  ) {
    fail("Verified receipt or post-apply snapshot integrity missing");
  }
  const postApply = JSON.parse(postApplyBytes.toString("utf8"));
  equal(
    revisionsOf(postApply),
    receipt.revisions,
    "Saved post-apply revisions differ from receipt",
  );
  assertTransactionState({
    manifest,
    before,
    current: postApply,
    transactionId: receipt.transactionId,
  });
  return postApply;
}

// A repeat run is complete only when the complete resulting documents match,
// allowing Sanity's generated timestamps/revisions on changed documents alone.
export function assertRestoreState({ manifest, before, current }) {
  planRestoreIdentity(current);
  if (isDeepStrictEqual(sorted(current), sorted(before))) return "ready";
  const expected = expectedAfter(before, manifest);
  const changed = new Set(manifest.mutations.map((m) => m.create?._id ?? m.patch.id));
  if (current.length !== expected.length) fail("Snapshot changed; regenerate the plan");
  for (const doc of expected) {
    const actual = current.find((item) => item._id === doc._id);
    if (!actual) fail(`Snapshot changed: ${doc._id}`);
    equal(
      changed.has(doc._id) ? content(actual) : actual,
      changed.has(doc._id) ? content(doc) : doc,
      `Document or revision changed: ${doc._id}`,
    );
  }
  return "complete";
}

function planRestoreIdentity(documents) {
  const slugs = new Set();
  const ids = new Set();
  for (const doc of documents) {
    if (/^(drafts|versions)\./.test(doc._id))
      fail("Open draft or release conflicts with restoration");
    if (ids.has(doc._id)) fail(`Duplicate document ID: ${doc._id}`);
    ids.add(doc._id);
    if (doc._type !== "treatment") continue;
    if (!doc.slug?.current || slugs.has(doc.slug.current))
      fail("Duplicate or missing treatment slug");
    slugs.add(doc.slug.current);
  }
}

export function planRollback({ manifest, before, postApply, current }) {
  if (assertRestoreState({ manifest, before, current: postApply }) !== "complete") {
    fail("Rollback requires a verified post-apply snapshot");
  }
  equal(sorted(current), sorted(postApply), "Later edits detected; rollback aborted");
  const mutations = [];
  // Restore references first, then delete created records, in the same transaction.
  for (const change of manifest.rollback.filter((item) => item.set)) {
    const doc = current.find((item) => item._id === change.id);
    if (!doc?._rev) fail(`Missing post-apply revision: ${change.id}`);
    mutations.push({
      patch: {
        id: change.id,
        ifRevisionID: doc._rev,
        ...(Object.keys(change.set).length ? { set: change.set } : {}),
        ...(change.unset?.length ? { unset: change.unset } : {}),
      },
    });
  }
  for (const { create } of manifest.mutations.filter((item) => item.create)) {
    const doc = current.find((item) => item._id === create._id);
    if (!doc?._rev) fail(`Missing post-apply revision: ${create._id}`);
    // Sanity delete has no revision guard. The preceding guarded patch makes
    // deletion abort atomically if an editor has changed the created record.
    mutations.push({ patch: { id: doc._id, ifRevisionID: doc._rev, set: { title: doc.title } } });
    mutations.push({ delete: { id: doc._id } });
  }
  return mutations;
}
