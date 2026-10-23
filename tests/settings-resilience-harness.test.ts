import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

// Exercise the actual harness with synthetic child processes, without building Next or using CMS.
const fakeNext = `
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
const evidence = path.dirname(process.env.SETTINGS_FIXTURE_STATE);
const phase = readFileSync(path.resolve(process.cwd(), "../../../phase"), "utf8");
const command = process.argv[2];
if (command === "build" && phase === "checks") {
  mkdirSync(".next/server/app", { recursive: true });
  writeFileSync(".next/prerender-manifest.json", JSON.stringify({ routes: { "/contact": { initialRevalidateSeconds: 3600 } } }));
  writeFileSync(".next/server/app/contact.html", "082 895 9598 Holisticrep9@gmail.com 4411042584729737012");
} else {
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      if (phase === "stubborn") return;
      writeFileSync(path.join(evidence, "stopping"), signal);
      setTimeout(() => process.exit(0), 200);
    });
  }
  writeFileSync(path.join(evidence, command + ".pid"), String(process.pid));
  setInterval(() => {}, 1000);
}
`;

function isAlive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function fixture(phase: string) {
  const root = await mkdtemp(path.join(tmpdir(), "settings-harness-"));
  for (const directory of [
    "app",
    "components",
    "emails",
    "lib",
    "public",
    "sanity",
    "scripts/fixtures",
    "node_modules/next/dist/bin",
  ]) {
    await mkdir(path.join(root, directory), { recursive: true });
  }
  for (const file of [
    "sanity.config.ts",
    "next.config.ts",
    "next-env.d.ts",
    "tsconfig.json",
    "package-lock.json",
  ]) {
    await writeFile(path.join(root, file), "");
  }
  await writeFile(path.join(root, "package.json"), JSON.stringify({ type: "module" }));
  await writeFile(path.join(root, "phase"), phase);
  await writeFile(path.join(root, "scripts/fixtures/settings-resilience-preload.mjs"), "");
  await writeFile(path.join(root, "node_modules/next/dist/bin/next"), fakeNext);
  const harness = path.join(root, "scripts/verify-settings-resilience.mjs");
  await writeFile(harness, await readFile("scripts/verify-settings-resilience.mjs", "utf8"));
  const parent = spawn(process.execPath, [harness], {
    cwd: root,
    env: {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      TMPDIR: process.env.TMPDIR,
      NODE_ENV: "test",
    },
    stdio: "ignore",
  });
  const closed = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
    (resolve, reject) => {
      parent.once("error", reject);
      parent.once("close", (code, signal) => resolve({ code, signal }));
    },
  );
  const evidence = path.join(root, ".context/settings-resilience");
  let pid: number | undefined;
  return {
    parent,
    closed,
    evidence,
    async child() {
      const file = path.join(evidence, phase === "checks" ? "start.pid" : "build.pid");
      await vi.waitFor(() => expect(existsSync(file)).toBe(true), { timeout: 5000 });
      pid = Number(await readFile(file, "utf8"));
      return pid;
    },
    async dispose() {
      if (parent.exitCode === null && parent.signalCode === null) parent.kill("SIGKILL");
      if (pid && isAlive(pid)) process.kill(pid, "SIGKILL");
      await closed;
      await rm(root, { recursive: true, force: true });
    },
  };
}

describe("settings verification cancellation", () => {
  it.each([
    ["build", "SIGINT", 130],
    ["build", "SIGTERM", 143],
    ["checks", "SIGINT", 130],
    ["checks", "SIGTERM", 143],
  ] as const)("cleans children and lock during %s on %s", async (phase, signal, code) => {
    const run = await fixture(phase);
    try {
      const pid = await run.child();
      run.parent.kill(signal);
      await vi.waitFor(() => expect(existsSync(path.join(run.evidence, "stopping"))).toBe(true));
      expect(existsSync(path.join(run.evidence, "run.lock"))).toBe(true);
      expect(await run.closed).toEqual({ code, signal: null });
      await vi.waitFor(() => expect(isAlive(pid)).toBe(false));
      expect(existsSync(path.join(run.evidence, "run.lock"))).toBe(false);
    } finally {
      await run.dispose();
    }
  });

  it("reaps a child that ignores SIGTERM before releasing the lock", async () => {
    const run = await fixture("stubborn");
    try {
      const pid = await run.child();
      run.parent.kill("SIGTERM");
      expect(await run.closed).toEqual({ code: 143, signal: null });
      expect(isAlive(pid)).toBe(false);
      expect(existsSync(path.join(run.evidence, "run.lock"))).toBe(false);
    } finally {
      await run.dispose();
    }
  }, 15000);
});
