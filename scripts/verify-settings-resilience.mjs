import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import {
  appendFile,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  symlink,
  utimes,
  writeFile,
} from "node:fs/promises";
import { createWriteStream, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const evidence = path.join(repo, ".context/settings-resilience");
const fixture = path.join(evidence, "site");
const stateFile = path.join(evidence, "state.json");
const eventsFile = path.join(evidence, "transport-events.jsonl");
const preload = path.join(repo, "scripts/fixtures/settings-resilience-preload.mjs");
const report = {
  generatedAt: new Date().toISOString(),
  checks: [],
  boundaries:
    "Synthetic CMS transport and browser API; no production dataset, Redis or email access.",
};
let server;

await mkdir(evidence, { recursive: true });
const lock = path.join(evidence, "run.lock");
try {
  await mkdir(lock);
} catch (error) {
  if (error.code === "EEXIST")
    throw new Error(
      "Verification is already running; stop it before rerunning. Remove a stale .context/settings-resilience/run.lock only after confirming no fixture is active.",
    );
  throw error;
}
process.once("exit", () => rmSync(lock, { recursive: true, force: true }));
try {
  for (const name of await readdir(evidence)) {
    if (
      /\.(png|log)$/.test(name) ||
      ["results.json", "browser-results.json", "browser-check.cjs"].includes(name)
    )
      await rm(path.join(evidence, name), { force: true });
  }
  await rm(fixture, { recursive: true, force: true });
  await mkdir(fixture);
  // Deliberate allowlist: no .env files, copied build cache, credentials or local configuration.
  for (const name of [
    "app",
    "components",
    "emails",
    "lib",
    "public",
    "sanity",
    "sanity.config.ts",
    "next.config.ts",
    "next-env.d.ts",
    "tsconfig.json",
    "package.json",
    "package-lock.json",
  ]) {
    await cp(path.join(repo, name), path.join(fixture, name), { recursive: true });
  }
  // Resolve the shared node_modules symlink inside a declared parent root (fixture only).
  await appendFile(
    path.join(fixture, "next.config.ts"),
    `\nnextConfig.turbopack = { ...nextConfig.turbopack, root: ${JSON.stringify(repo)} };\n`,
  );
  await symlink(path.join(repo, "node_modules"), path.join(fixture, "node_modules"), "dir");
  await writeFile(eventsFile, "");
  const env = {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    TMPDIR: process.env.TMPDIR || "/tmp",
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
    NEXT_PUBLIC_SANITY_PROJECT_ID: "resiliencefixture",
    NEXT_PUBLIC_SANITY_DATASET: "verification",
    NEXT_PUBLIC_SITE_URL: "http://127.0.0.1",
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: "GTM-FIXTURE",
    SETTINGS_FIXTURE_STATE: stateFile,
    SETTINGS_FIXTURE_EVENTS: eventsFile,
    NODE_OPTIONS: `--import=${pathToFileURL(preload).href}`,
  };
  const setState = (settings, services = "valid") =>
    writeFile(stateFile, JSON.stringify({ settings, services }));
  const events = async () =>
    (await readFile(eventsFile, "utf8"))
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  function run(args, logName) {
    const child = spawn(process.execPath, args, {
      cwd: fixture,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const log = createWriteStream(path.join(evidence, logName), { flags: "a" });
    log.write(
      `\nFixture process started ${new Date().toISOString()}: ${args.slice(1).join(" ")}\n`,
    );
    child.stdout.pipe(log);
    child.stderr.pipe(log);
    return child;
  }
  function exited(child, terminating = false) {
    if (child.exitCode !== null || child.signalCode !== null) {
      return child.exitCode === 0 ||
        (terminating && (child.exitCode === 143 || child.signalCode === "SIGTERM"))
        ? Promise.resolve()
        : Promise.reject(
            new Error(
              `Fixture process exited ${child.exitCode}; see .context/settings-resilience logs`,
            ),
          );
    }
    return new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("exit", (code, signal) =>
        code === 0 || (terminating && (code === 143 || signal === "SIGTERM"))
          ? resolve()
          : reject(
              new Error(`Fixture process exited ${code}; see .context/settings-resilience logs`),
            ),
      );
    });
  }
  async function stop() {
    if (server) {
      const active = server;
      server = undefined;
      const done = exited(active, true);
      active.kill("SIGTERM");
      let timer;
      try {
        await Promise.race([
          done,
          new Promise((_, reject) => {
            timer = setTimeout(() => {
              active.kill("SIGKILL");
              reject(new Error("Fixture server exceeded its 5s shutdown grace period"));
            }, 5000);
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
    }
  }
  const listener = createServer();
  await new Promise((resolve) => listener.listen(0, "127.0.0.1", resolve));
  const port = listener.address().port;
  await new Promise((resolve) => listener.close(resolve));
  const origin = `http://127.0.0.1:${port}`;
  async function start() {
    server = run(
      [
        path.join(repo, "node_modules/next/dist/bin/next"),
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        String(port),
      ],
      "server.log",
    );
    const readyUntil = performance.now() + 15000;
    while (performance.now() < readyUntil) {
      try {
        if ((await fetch(origin + "/icon.svg", { signal: AbortSignal.timeout(1000) })).ok) return;
      } catch {}
      await delay(100);
    }
    throw new Error("Fixture server did not start");
  }
  async function page(route) {
    const start = performance.now();
    const response = await fetch(origin + route, { signal: AbortSignal.timeout(15000) });
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert(!html.includes("205 Nguyễn Đình Chiểu"), "closed branch must stay absent");
    return {
      html,
      ms: Math.round(performance.now() - start),
      cache: response.headers.get("x-nextjs-cache"),
    };
  }
  async function pollPage(route, matches) {
    let result;
    for (let attempt = 0; attempt < 80; attempt++) {
      result = await page(route);
      if (matches(result)) return result;
      await delay(100);
    }
    return result;
  }
  function assertFallback(html) {
    assert(html.includes("082 895 9598"));
    assert(html.includes("Holisticrep9@gmail.com"));
    assert(html.includes("4411042584729737012"));
  }
  async function ageCaches() {
    const old = new Date(Date.now() - 3_700_000);
    async function walk(dir) {
      for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
        const name = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(name);
        else {
          if (name.endsWith(".meta")) {
            const meta = JSON.parse(await readFile(name, "utf8"));
            if ("routeCacheLastModified" in meta) {
              meta.routeCacheLastModified = old.getTime();
              await writeFile(name, JSON.stringify(meta));
            }
          }
          await utimes(name, old, old);
        }
      }
    }
    await walk(path.join(fixture, ".next/server/app"));
    // Next 16.3 stores promoted ISR responses separately from immutable build seeds.
    await walk(path.join(fixture, ".next/server/route-cache"));
    await walk(path.join(fixture, ".next/cache/fetch-cache"));
  }

  try {
    await setState("reject");
    console.log("Building isolated production fixture with settings rejection...");
    await exited(run([path.join(repo, "node_modules/next/dist/bin/next"), "build"], "build.log"));
    const manifest = JSON.parse(
      await readFile(path.join(fixture, ".next/prerender-manifest.json"), "utf8"),
    );
    assert.equal(manifest.routes["/contact"].initialRevalidateSeconds, 3600);
    assertFallback(await readFile(path.join(fixture, ".next/server/app/contact.html"), "utf8"));
    report.checks.push({
      check: "cold build rejection",
      result: "approved fallback; /contact revalidate=3600",
    });
    await start();
    const beforeWarm = (await events()).length;
    assertFallback((await page("/contact")).html);
    assertFallback((await page("/contact")).html);
    assert.equal((await events()).length, beforeWarm);
    report.checks.push({
      check: "warm prerender",
      result: "fallback HTML served without transport",
    });

    // Error responses are not cached. Each dynamic booking request exercises the real server boundary.
    for (const mode of [
      "reject",
      "401",
      "403",
      "500",
      "missing",
      "invalid-json",
      "invalid-result",
      "stall",
    ]) {
      await stop();
      await rm(path.join(fixture, ".next/cache/fetch-cache"), { recursive: true, force: true });
      await setState(mode, mode === "stall" ? "stall" : "reject");
      const from = (await events()).length;
      await start();
      const result = await page("/booking?service=training");
      assertFallback(result.html);
      assert(!result.html.replaceAll("<!-- -->", "").includes("Dịch vụ: Fixture"));
      const reads = (await events()).slice(from);
      const settingsReads = reads.filter((e) => e.target === "settings" && !e.aborted);
      assert.equal(
        settingsReads.length,
        1,
        `${mode}: shared consumers must use one settings read without retries`,
      );
      if (mode === "stall") {
        assert(result.ms >= 4900 && result.ms < 7500, `deadline render took ${result.ms}ms`);
        assert(reads.some((e) => e.target === "settings" && e.aborted));
        assert(reads.some((e) => e.target === "services" && e.aborted));
      }
      report.checks.push({
        check: `dynamic ${mode}`,
        ms: result.ms,
        settingsReads: settingsReads.length,
        aborted: reads.filter((e) => e.aborted).map((e) => e.target),
      });
    }

    await stop();
    await rm(path.join(fixture, ".next/cache/fetch-cache"), { recursive: true, force: true });
    await setState("reject", "valid");
    await start();
    const healthyContext = await page("/booking?service=training");
    assertFallback(healthyContext.html);
    assert(
      healthyContext.html
        .replaceAll("<!-- -->", "")
        .includes("Dịch vụ: Fixture published training"),
    );
    report.checks.push({
      check: "settings failure with healthy service context",
      result: "exact published training context retained",
    });

    // Expire the actual disk cache metadata in the fixture, preserving the production 3600s policy.
    await stop();
    await setState("valid");
    await ageCaches();
    await start();
    const stale = await page("/contact");
    let recovered = await pollPage("/contact", ({ html }) => html.includes("0901112233"));
    assert(
      recovered.html.includes("0901112233"),
      "expired fallback route must recover published settings",
    );
    assert(recovered.html.includes("9988776655"));
    report.checks.push({
      check: "expired fallback HTML recovery",
      firstCache: stale.cache,
      recoveredCache: recovered.cache,
      result: "published contacts restored",
    });
    const cachedReads = (await events()).length;
    await setState("reject");
    assert((await page("/booking")).html.includes("0901112233"));
    assert.equal((await events()).length, cachedReads);
    report.checks.push({
      check: "warm valid settings cache",
      result: "published contacts survive transport outage; no new reads",
    });

    // A malformed HTTP-200 response can enter the raw fetch cache; prove its finite recovery too.
    await stop();
    await rm(path.join(fixture, ".next/cache/fetch-cache"), { recursive: true, force: true });
    await setState("invalid-result");
    await start();
    assertFallback((await page("/booking")).html);
    await setState("valid");
    assertFallback((await page("/booking")).html);
    await stop();
    await ageCaches();
    await start();
    recovered = await pollPage("/booking", ({ html }) => html.includes("0901112233"));
    assert(recovered.html.includes("0901112233"));
    report.checks.push({
      check: "expired malformed HTTP-200 data recovery",
      result: "fallback while raw cache fresh; published contacts after expiry/revalidation",
    });

    // Exercise malformed data plus static HTML together, including the second ISR window.
    await stop();
    await rm(path.join(fixture, ".next/cache/fetch-cache"), { recursive: true, force: true });
    await ageCaches();
    await setState("invalid-result");
    await start();
    recovered = await pollPage("/contact", ({ html }) => html.includes("082 895 9598"));
    assertFallback(recovered.html);
    await setState("valid");
    assertFallback((await page("/contact")).html);
    let staticCycles = 0;
    while (staticCycles < 2) {
      await stop();
      await ageCaches();
      await start();
      staticCycles++;
      await page("/contact");
      recovered = await pollPage("/contact", ({ cache }) => cache === "HIT");
      if (recovered.html.includes("0901112233")) break;
      assertFallback(recovered.html);
    }
    assert(
      recovered.html.includes("0901112233"),
      "static malformed settings must recover within two revalidation windows",
    );
    report.checks.push({
      check: "static malformed HTTP-200 recovery",
      acceleratedRevalidationCycles: staticCycles,
      result: "published contacts restored across data and HTML caches",
    });

    await stop();
    await rm(path.join(fixture, ".next/cache/fetch-cache"), { recursive: true, force: true });
    await setState("reject", "reject");
    await ageCaches();
    await start();
    // Generate a repeatable Playwright MCP fixture without adding a project dependency.
    const browserSource = await readFile(
      path.join(repo, "scripts/fixtures/settings-resilience-browser.mjs"),
      "utf8",
    );
    await writeFile(
      path.join(evidence, "browser-check.cjs"),
      browserSource
        .replace("export default ", "")
        .replaceAll("__FIXTURE_ORIGIN__", origin)
        .replaceAll("__EVIDENCE_DIR__", evidence),
    );
    report.origin = origin;
    await writeFile(path.join(evidence, "results.json"), JSON.stringify(report, null, 2) + "\n");
    console.log(
      `Passed ${report.checks.length} production checks. Evidence: .context/settings-resilience/results.json`,
    );
    if (process.argv.includes("--serve")) {
      console.log(
        `Browser fixture ready at ${origin}; run .context/settings-resilience/browser-check.cjs with Playwright MCP.`,
      );
      const finish = async () => {
        await stop();
        process.exit(0);
      };
      process.once("SIGINT", finish);
      process.once("SIGTERM", finish);
      await new Promise(() => {});
    }
  } finally {
    await stop();
  }
} finally {
  await rm(lock, { recursive: true, force: true });
}
