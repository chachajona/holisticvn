import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";

const base = new URL(process.env.SMOKE_BASE_URL || "http://127.0.0.1:3102");
assert(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Run against a local fallback build only");

async function request(path, options = {}) {
  return fetch(new URL(path, base), { ...options, signal: AbortSignal.timeout(15_000) });
}

let ready = false;
for (let attempt = 0; attempt < 40; attempt++) {
  try {
    ready = (await request("/")).ok;
  } catch { /* The production server may still be starting. */ }
  if (ready) break;
  await setTimeout(500);
}
assert(ready, "Production server did not become ready");

const assets = new Set();
for (const path of ["/", "/services", "/treatments", "/booking"]) {
  const response = await request(path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, /<!DOCTYPE html>/i, `${path}: HTML5 doctype`);
  assert.match(html, /<html[^>]*lang="vi"/, `${path}: Vietnamese document`);
  assert.match(html, /<main[^>]*id="main"/, `${path}: skip link target`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${path}: one h1`);
  assert.match(html, /<meta[^>]*name="viewport"/, `${path}: responsive viewport`);
  assert.match(html, /<title>[^<]+<\/title>/, `${path}: title`);
  assert.match(html, /<meta[^>]*name="description"/, `${path}: description`);
  for (const [, src] of html.matchAll(/<script[^>]*src="([^"]+)"/g)) {
    const url = new URL(src, base);
    assert(!(url.origin !== base.origin && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)), `${path}: unexpected local preview script`);
    assert(!/live\.js/.test(url.pathname), `${path}: unexpected live preview script`);
  }
  for (const [, src] of html.matchAll(/<img[^>]*src="([^"]+)"/g)) {
    if (src.startsWith("/")) assets.add(src.replaceAll("&amp;", "&"));
  }
  console.log(`PASS ${path}: fallback document, metadata and production scripts`);
}
for (const src of assets) {
  assert.equal((await request(src)).status, 200, `Image missing: ${src}`);
}
console.log(`PASS ${assets.size} local image URLs`);

const invalid = await request("/api/leads", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
});
assert.equal(invalid.status, 400, "Invalid form input must be rejected");
assert((await invalid.json()).error, "Invalid input must return an error");

console.log("PASS invalid input (400); provider failure is covered by unit tests");
