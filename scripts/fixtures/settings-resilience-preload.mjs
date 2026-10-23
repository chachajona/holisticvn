// Test-only transport. Loaded with --import inside the isolated verification copy.
import { appendFileSync, readFileSync } from "node:fs";
const stateFile = process.env.SETTINGS_FIXTURE_STATE;
const eventsFile = process.env.SETTINGS_FIXTURE_EVENTS;
const originalFetch = globalThis.fetch;
const event = (target, mode, extra = {}) =>
  appendFileSync(eventsFile, JSON.stringify({ target, mode, ...extra }) + "\n");

globalThis.fetch = async function fixtureFetch(input, init = {}) {
  const url = new URL(typeof input === "string" ? input : input.url || String(input));
  if (!url.hostname.endsWith(".sanity.io")) {
    if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
      return originalFetch(input, init);
    }
    throw new Error("Verification blocks external transport");
  }
  if (
    url.hostname !== "resiliencefixture.api.sanity.io" ||
    !url.pathname.includes("/data/query/verification")
  ) {
    throw new Error("Verification permits only the synthetic query endpoint");
  }
  const state = JSON.parse(readFileSync(stateFile, "utf8"));
  const query = url.searchParams.get("query") || JSON.parse(init.body || "{}").query || "";
  const target = query.includes('"siteSettings"')
    ? "settings"
    : query.includes('"servicesPage"')
      ? "services"
      : "content";
  const mode =
    target === "settings" ? state.settings : target === "services" ? state.services : "empty";
  event(target, mode);
  if (mode === "reject") throw new TypeError("Synthetic network failure");
  if (mode === "stall") {
    return new Promise((_, reject) => {
      const signal = init.signal || input.signal;
      const abort = () => {
        event(target, mode, { aborted: true });
        reject(new DOMException("Synthetic abort", "AbortError"));
      };
      if (signal?.aborted) abort();
      else signal?.addEventListener("abort", abort, { once: true });
    });
  }
  if (["401", "403", "500"].includes(mode)) {
    return new Response(JSON.stringify({ error: "Synthetic provider failure" }), {
      status: Number(mode),
      headers: { "content-type": "application/json" },
    });
  }
  if (mode === "invalid-json")
    return new Response("{", { headers: { "content-type": "application/json" } });
  const settings = {
    contactPhone: "0901112233",
    contactEmail: "settings-fixture@example.invalid",
    locations: [
      { name: "Closed fixture branch", address: "205 Nguyễn Đình Chiểu", isPrimary: true },
    ],
    socialMedia: { zalo: "9988776655" },
  };
  const service = {
    group: "training",
    title: "Fixture published training",
    shortTitle: "Training",
    summary: "",
    body: "",
    bullets: [],
    treatments: [],
  };
  const result =
    mode === "valid"
      ? target === "settings"
        ? settings
        : [service]
      : mode === "invalid-result"
        ? "invalid"
        : target === "settings"
          ? null
          : [];
  return new Response(JSON.stringify({ result }), {
    headers: { "content-type": "application/json" },
  });
};
