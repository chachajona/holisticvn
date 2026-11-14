import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { describe, expect, it } from "vitest";
// @ts-expect-error plain ESM operational helper without declarations
import * as restore from "../scripts/lib/treatment-restore.mjs";
const {
  assertApprovedManifest,
  assertRestoreState,
  assertTarget,
  expectedAfter,
  planRestore,
  planRollback,
  RESTORE_TARGET,
} = restore;

type Ref = { _key: string; _type: string; _ref: string; _weak?: boolean };
type Group = { _key: string; group: string; treatments?: Ref[] };
type Doc = {
  _id: string;
  _type: string;
  _rev?: string;
  slug?: { current: string };
  title?: string;
  groups?: Group[];
  [key: string]: unknown;
};
type Mutation = {
  create?: Doc;
  patch?: { id: string; ifRevisionID: string; set: Record<string, unknown>; unset?: string[] };
  delete?: { id: string };
};
const seed = JSON.parse(readFileSync("scripts/seed/treatments.json", "utf8"));
const seo = JSON.parse(readFileSync("lib/treatment-seo.json", "utf8"));
const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8"));
const ref = (slug: string): Ref => ({
  _key: `editor-${slug}`,
  _type: "reference",
  _ref: `legacy-${slug}`,
});
const before = (): Doc[] => [
  ...["cupping", "cold-plunge", "infrared-heat"].map((slug) => ({
    _id: `legacy-${slug}`,
    _type: "treatment",
    _rev: `original-${slug}`,
    slug: { current: slug },
    title: `Existing ${slug}`,
    price: 123,
    seo: { title: "Editorial SEO" },
    protocols: [{ title: "Existing editor content" }],
  })),
  {
    _id: "methodsPage",
    _type: "methodsPage",
    _rev: "methods-r1",
    title: "Methods preserved",
    groups: [
      { _key: "manual", group: "manual", treatments: [ref("cupping")] },
      { _key: "electro", group: "electro", treatments: [] },
      { _key: "cold", group: "cold", treatments: [ref("cold-plunge")] },
      { _key: "infrared", group: "infrared", treatments: [ref("infrared-heat")] },
      { _key: "rehab", group: "rehab", treatments: [] },
    ],
  },
  {
    _id: "servicesPage",
    _type: "servicesPage",
    _rev: "services-r1",
    groups: [
      { _key: "manual", group: "manual", treatments: [ref("cupping")] },
      { _key: "electro", group: "electro", treatments: [] },
      {
        _key: "recovery",
        group: "recovery",
        treatments: [ref("infrared-heat"), ref("cold-plunge")],
      },
      { _key: "training", group: "training", treatments: [] },
    ],
  },
];
const run = (documents = before(), overrides: object = {}) =>
  planRestore({ seed, seo, links, documents, ...overrides });
const manifestFor = (documents = before()) => ({
  issue: 58,
  sources: [{ path: "reviewed-source", sha256: "approved-hash" }],
  ...run(documents),
});
const pageGroups = (docs: Doc[], id = "methodsPage") => docs.find((doc) => doc._id === id)!.groups!;
const applied = (docs = before(), manifest = manifestFor(docs)): Doc[] => {
  const changed = new Set(manifest.mutations.map((m: Mutation) => m.create?._id ?? m.patch!.id));
  return expectedAfter(docs, manifest).map((doc: Doc) =>
    changed.has(doc._id) ? { ...doc, _rev: `post-${doc._id}`, _updatedAt: "2026-11-03" } : doc,
  );
};

describe("missing-only treatment restoration", () => {
  it("refuses to run while the legacy heat-light slug exists", () => {
    const docs = before().map((doc) =>
      doc.slug?.current === "infrared-heat" ? { ...doc, slug: { current: "heat-light" } } : doc,
    );
    expect(() => run(docs)).toThrow(/heat-light/);
  });

  it("creates exactly eight reviewed documents, with per-slug SEO and no protocols or assets", () => {
    const docs = before();
    const original = structuredClone(docs);
    const plan = run(docs);
    const creates = (plan.mutations as Mutation[]).flatMap((m) => (m.create ? [m.create] : []));
    expect(creates).toHaveLength(8);
    for (const doc of creates) {
      const source = seed.find((item: Doc) => item.slug?.current === doc.slug?.current);
      expect(doc).toEqual({ ...source, seo: { _type: "seo", ...seo[doc.slug!.current] } });
      for (const field of ["protocols", "image", "benefits", "duration"]) {
        expect(doc).not.toHaveProperty(field);
      }
    }
    expect(docs).toEqual(original);
  });

  it("never mutates existing treatments and touches only five reference arrays", () => {
    const plan = run();
    const patches = (plan.mutations as Mutation[]).flatMap((m) => (m.patch ? [m.patch] : []));
    expect(patches.map((patch) => patch.id)).toEqual(["methodsPage", "servicesPage"]);
    expect(patches.map((patch) => Object.keys(patch.set)).flat()).toEqual([
      'groups[_key=="manual"].treatments',
      'groups[_key=="electro"].treatments',
      'groups[_key=="manual"].treatments',
      'groups[_key=="electro"].treatments',
      'groups[_key=="recovery"].treatments',
    ]);
    expect(patches.map((patch) => patch.ifRevisionID)).toEqual(["methods-r1", "services-r1"]);
    const after = applied();
    expect(after.filter((doc) => doc._id.startsWith("legacy-"))).toEqual(before().slice(0, 3));
    expect(after.find((doc) => doc._id === "methodsPage")!.title).toBe("Methods preserved");
  });

  it("preserves complete existing references, including editor keys", () => {
    const plan = run();
    const manual = plan.mutations[8].patch.set['groups[_key=="manual"].treatments'];
    expect(manual[1]).toEqual(ref("cupping"));
  });

  it("is an exact no-op after restoration", () => {
    const after = applied();
    expect(run(after).mutations).toEqual([]);
    expect(assertRestoreState({ manifest: manifestFor(), before: before(), current: after })).toBe(
      "complete",
    );
  });

  it.each(["drafts.treatment-iastm", "versions.release.treatment-iastm", "drafts.methodsPage"])(
    "rejects the unpublished identity %s",
    (id) => {
      expect(() => run([...before(), { _id: id, _type: "treatment" }])).toThrow(/draft or release/);
    },
  );

  it("rejects duplicate slugs and occupied seed IDs, even for other document types", () => {
    expect(() =>
      run([...before(), { _id: "duplicate", _type: "treatment", slug: { current: "cupping" } }]),
    ).toThrow(/duplicate treatment slug/);
    expect(() => run([...before(), { _id: "treatment-iastm", _type: "other" }])).toThrow(
      /Occupied document ID/,
    );
  });

  it.each(["other", "treatment"])(
    "rejects a seed ID occupied by an unrelated %s document even when the slug exists",
    (type) => {
      const source = seed.find((doc: Doc) => doc.slug?.current === "cupping");
      const occupied: Doc = { _id: source._id, _type: type };
      if (type === "treatment") occupied.slug = { current: "unrelated-treatment" };
      expect(() => run([...before(), occupied])).toThrow(/Occupied document ID/);
    },
  );

  it("accepts an occupied seed ID when it identifies the same published treatment", () => {
    const docs = before();
    const source = seed.find((doc: Doc) => doc.slug?.current === "cupping");
    docs[0]._id = source._id;
    for (const page of docs.filter((doc) => doc.groups)) {
      for (const group of page.groups!) {
        for (const reference of group.treatments ?? []) {
          if (reference._ref === "legacy-cupping") reference._ref = source._id;
        }
      }
    }
    const plan = run(docs);
    const after = expectedAfter(docs, plan);
    expect(after.find((doc: Doc) => doc._id === source._id)).toEqual(docs[0]);
    expect(plan.mutations.filter((mutation: Mutation) => mutation.create)).toHaveLength(8);
  });

  it.each(["missing", "duplicate", "unsafe", "duplicate-key"])("rejects %s groups", (kind) => {
    const docs = before();
    const groups = pageGroups(docs);
    if (kind === "missing") groups.shift();
    if (kind === "duplicate") groups.push({ ...groups[0], _key: "other-key" });
    if (kind === "unsafe") groups[0]._key = 'key"]';
    if (kind === "duplicate-key") groups[1]._key = groups[0]._key;
    expect(() => run(docs)).toThrow(/group/);
  });

  it.each(["unexpected", "duplicate-ref", "duplicate-key", "weak", "collision"])(
    "rejects %s catalogue references",
    (kind) => {
      const docs = before();
      const refs = pageGroups(docs)[0].treatments!;
      if (kind === "unexpected") refs[0]._ref = "drafts.something";
      if (kind === "duplicate-ref") refs.push({ ...refs[0], _key: "another" });
      if (kind === "duplicate-key") {
        docs.push({ _id: "existing-iastm", _type: "treatment", slug: { current: "iastm" } });
        refs.push({ ...refs[0], _ref: "existing-iastm" });
      }
      if (kind === "weak") refs[0]._weak = true;
      if (kind === "collision") refs[0]._key = "dry-needling";
      expect(() => run(docs)).toThrow(/reference|Reference/);
    },
  );

  it("requires a reviewed SEO entry and valid approved group slugs", () => {
    expect(() => run(before(), { seo: {} })).toThrow(/reviewed SEO/);
    expect(() => run(before(), { links: { methodsPage: { manual: ["unknown"] } } })).toThrow(
      /approved slugs/,
    );
  });

  it.each([
    ["protocols", null],
    ["image", false],
    ["benefits", ""],
    ["duration", 0],
    ["unexpected", null],
  ])("rejects seed field %s by presence even when falsey", (field, value) => {
    const modifiedSeed = structuredClone(seed);
    modifiedSeed[0][field] = value;
    expect(() => run(before(), { seed: modifiedSeed })).toThrow(/Unapproved seed fields/);
  });

  it("binds the manifest to exact source hashes, generated payloads and rollback backup", () => {
    const docs = before();
    const manifest = manifestFor(docs);
    const args = { manifest, before: docs, seed, seo, links, sourceHashes: manifest.sources };
    expect(() => assertApprovedManifest(args)).not.toThrow();
    expect(() => assertApprovedManifest({ ...args, sourceHashes: [] })).toThrow(/hashes changed/);
    const modified = structuredClone(manifest);
    modified.mutations[0].create.title = "Unreviewed title";
    expect(() => assertApprovedManifest({ ...args, manifest: modified })).toThrow(/differs/);
    const changedBackup = structuredClone(manifest);
    changedBackup.rollback = [];
    expect(() => assertApprovedManifest({ ...args, manifest: changedBackup })).toThrow(/rollback/);
  });

  it("rejects any concurrent edit or partial application, including preserved revisions", () => {
    const docs = before();
    const manifest = manifestFor(docs);
    expect(assertRestoreState({ manifest, before: docs, current: docs })).toBe("ready");
    for (const mutate of [
      (current: Doc[]) => (current[0]._rev = "changed"),
      (current: Doc[]) => (current[0].price = 999),
      (current: Doc[]) => current.pop(),
      (current: Doc[]) => (current.find((doc) => doc._id === "treatment-iastm")!.title = "Changed"),
    ]) {
      const current = applied(docs, manifest);
      mutate(current);
      expect(() => assertRestoreState({ manifest, before: docs, current })).toThrow(/changed/);
    }
    const changedBefore = structuredClone(docs);
    changedBefore[0]._rev = "changed";
    expect(() => assertRestoreState({ manifest, before: docs, current: changedBefore })).toThrow();
  });

  it("requires the approved live deployment, domain, project, commit and ready production state", () => {
    const target = {
      ...RESTORE_TARGET,
      deploymentId: "approved-deployment",
      commit: "approved-commit",
      domain: "https://www.holisticvn.com",
    };
    const deployment = {
      id: target.deploymentId,
      projectId: target.vercelProjectId,
      commit: target.commit,
      target: "production",
      readyState: "READY",
      aliases: ["www.holisticvn.com"],
    };
    expect(() => assertTarget(target, deployment)).not.toThrow();
    for (const overrides of [
      { id: "new-deployment" },
      { projectId: "other" },
      { commit: "new-commit" },
      { target: "preview" },
      { readyState: "ERROR" },
      { aliases: [] },
    ]) {
      expect(() => assertTarget(target, { ...deployment, ...overrides })).toThrow(
        /identity changed/,
      );
    }
    expect(() => assertTarget({ ...target, dataset: "staging" }, deployment)).toThrow(/target/);
  });

  it("restores only saved arrays and guards every created-record deletion by post-apply revision", () => {
    const docs = before();
    const manifest = manifestFor(docs);
    const postApply = applied(docs, manifest);
    const mutations: Mutation[] = planRollback({
      manifest,
      before: docs,
      postApply,
      current: postApply,
    });
    expect(mutations.slice(0, 2).map((mutation) => mutation.patch!.id)).toEqual([
      "methodsPage",
      "servicesPage",
    ]);
    expect(mutations[0].patch!.set['groups[_key=="manual"].treatments']).toEqual([ref("cupping")]);
    expect(mutations.filter((mutation) => mutation.delete)).toHaveLength(8);
    for (let index = 2; index < mutations.length; index += 2) {
      const patch = mutations[index].patch!;
      expect(patch.ifRevisionID).toBe(`post-${patch.id}`);
      expect(patch.set).toEqual({ title: postApply.find((doc) => doc._id === patch.id)!.title });
      expect(mutations[index + 1]).toEqual({ delete: { id: patch.id } });
    }
  });

  it("aborts rollback after any later edit and requires verified post-apply evidence", () => {
    const docs = before();
    const manifest = manifestFor(docs);
    const postApply = applied(docs, manifest);
    const current = structuredClone(postApply);
    current.at(-1)!._rev = "later-edit";
    expect(() => planRollback({ manifest, before: docs, postApply, current })).toThrow(
      /Later edits/,
    );
    expect(() => planRollback({ manifest, before: docs, postApply: docs, current: docs })).toThrow(
      /verified post-apply/,
    );
  });

  it("serializes strict creates, guarded patches and rollback into one SDK transaction each", () => {
    const client = createClient({
      projectId: "yjzexxml",
      dataset: "production",
      apiVersion: "2025-01-01",
      useCdn: false,
    });
    const docs = before();
    const manifest = manifestFor(docs);
    expect(client.transaction(manifest.mutations).serialize()).toEqual(manifest.mutations);
    const postApply = applied(docs, manifest);
    const rollback = planRollback({ manifest, before: docs, postApply, current: postApply });
    expect(client.transaction(rollback).serialize()).toEqual(rollback);
    expect(
      rollback.every((mutation: Mutation) => !mutation.patch || mutation.patch.ifRevisionID),
    ).toBe(true);
  });

  it("backs up absent arrays as unset rather than changing them to empty arrays", () => {
    const docs = before();
    delete pageGroups(docs)[1].treatments;
    const plan = run(docs);
    expect(
      plan.rollback.find((change: { id: string }) => change.id === "methodsPage").unset,
    ).toEqual(['groups[_key=="electro"].treatments']);
  });
});
