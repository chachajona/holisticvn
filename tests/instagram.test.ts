import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getInstagramPosts, parseInstagramPosts, syncInstagramFeed } from "@/lib/instagram";
import { redisCommand } from "@/lib/redis";

vi.mock("@/lib/redis", () => ({ redisCommand: vi.fn() }));

const now = Date.parse("2026-10-09T03:00:00Z");
const hour = 3600 * 1000;
const media = (id = "123", type = "IMAGE") => ({
  id,
  media_type: type,
  media_url: "https://scontent.cdninstagram.com/photo.jpg",
  thumbnail_url: "https://scontent.cdninstagram.com/cover.jpg",
  permalink: `https://www.instagram.com/p/${id}/`,
  timestamp: "2026-10-08T03:00:00Z",
});
let storage: Map<string, string>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(now);
  vi.stubEnv("INSTAGRAM_USER_ID", "456");
  vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "private-bootstrap-token");
  vi.stubEnv("INSTAGRAM_API_VERSION", "v25.0");
  storage = new Map();
  vi.mocked(redisCommand).mockImplementation(async ([command, key, value]) => {
    if (command === "GET") return storage.get(key) ?? null;
    if (command === "SET") {
      storage.set(key, value);
      return "OK";
    }
    return 1;
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("Instagram feed", () => {
  it("uses a thumbnail for videos even when their media URL is omitted", () => {
    const video = { ...media("reel", "VIDEO"), media_url: undefined };
    expect(parseInstagramPosts({ data: [video] })[0].image).toContain("cover.jpg");
  });

  it("uses the first carousel child as its cover", () => {
    const album = {
      ...media("album", "CAROUSEL_ALBUM"),
      media_url: undefined,
      children: { data: [{ media_type: "IMAGE", media_url: media().media_url }] },
    };
    expect(parseInstagramPosts({ data: [album] })[0].image).toContain("photo.jpg");
  });

  it("rejects unsafe media and post URLs and missing video thumbnails", () => {
    expect(
      parseInstagramPosts({
        data: [
          { ...media(), media_url: "http://127.0.0.1/photo.jpg" },
          { ...media(), media_url: "https://cdninstagram.com.evil.test/photo.jpg" },
          { ...media(), permalink: "https://evil.test/post" },
          { ...media(), permalink: "https://www.instagram.com:8080/p/123/" },
          { ...media("video", "VIDEO"), thumbnail_url: undefined },
        ],
      }),
    ).toEqual([]);
  });

  it("selects the four newest displayable posts", () => {
    const data = Array.from({ length: 6 }, (_, i) => ({
      ...media(String(i)),
      timestamp: `2026-10-0${i + 1}T03:00:00Z`,
    }));
    expect(parseInstagramPosts({ data }).map((p) => p.id)).toEqual(["5", "4", "3", "2"]);
  });

  it("makes no requests until a connection is configured", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "");
    expect(await getInstagramPosts()).toBeNull();
    expect(redisCommand).not.toHaveBeenCalled();
  });

  it("caches posts across requests and returns no token to the page", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [media()] })));
    vi.stubGlobal("fetch", fetch);
    const posts = await getInstagramPosts();
    expect(posts).toHaveLength(1);
    expect(JSON.stringify(posts)).not.toContain("private-bootstrap-token");
    expect(await getInstagramPosts()).toEqual(posts);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0].searchParams.has("access_token")).toBe(false);
  });

  it("refreshes and persists the new token before fetching posts", async () => {
    const fetch = vi.fn().mockImplementation(async (url: URL) => {
      if (url.pathname === "/refresh_access_token") {
        return Response.json({ access_token: "refreshed-private-token", expires_in: 5184000 });
      }
      return Response.json({ data: [media()] });
    });
    vi.stubGlobal("fetch", fetch);
    await syncInstagramFeed();
    vi.setSystemTime(now + 8 * 24 * hour);
    await syncInstagramFeed();
    expect(fetch.mock.calls[1][0].pathname).toBe("/refresh_access_token");
    expect(fetch.mock.calls[2][1].headers.Authorization).toBe("Bearer refreshed-private-token");
    const state = [...storage.values()].find((v) => v.includes("accessToken"));
    expect(JSON.parse(state!).accessToken).toBe("refreshed-private-token");
    expect(JSON.parse(state!).tokenExpiresAt).toBe(now + 68 * 24 * hour);
  });

  it("keeps a recent feed on failure and hides it after 48 hours", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ data: [media()] }));
    vi.stubGlobal("fetch", fetch);
    const posts = await getInstagramPosts();
    fetch.mockRejectedValue(new Error("provider failure with private details"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.setSystemTime(now + 2 * hour);
    expect(await getInstagramPosts()).toEqual(posts);
    vi.setSystemTime(now + 49 * hour);
    expect(await getInstagramPosts()).toEqual([]);
    expect(warn.mock.calls.flat().join(" ")).not.toContain("private details");
  });

  it("keeps the refreshed token when the following media request fails", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ data: [media()] }));
    vi.stubGlobal("fetch", fetch);
    await syncInstagramFeed();
    vi.setSystemTime(now + 8 * 24 * hour);
    fetch
      .mockResolvedValueOnce(
        Response.json({ access_token: "refreshed-private-token", expires_in: 5184000 }),
      )
      .mockRejectedValueOnce(new Error("media failed"));
    await expect(syncInstagramFeed()).rejects.toThrow("media failed");
    const state = [...storage.values()].find((v) => v.includes("accessToken"));
    expect(JSON.parse(state!).accessToken).toBe("refreshed-private-token");
    expect(JSON.parse(state!).syncedAt).toBe(now);
  });

  it("does not reuse the previous account connection after replacing the bootstrap token", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ data: [media("old")] }));
    vi.stubGlobal("fetch", fetch);
    await getInstagramPosts();
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "replacement-token");
    fetch.mockResolvedValue(Response.json({ data: [media("new")] }));
    expect((await getInstagramPosts())?.[0].id).toBe("new");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("removes old posts when Instagram reports an empty account", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ data: [media()] }));
    vi.stubGlobal("fetch", fetch);
    await getInstagramPosts();
    fetch.mockResolvedValue(Response.json({ data: [] }));
    vi.setSystemTime(now + 2 * hour);
    expect(await getInstagramPosts()).toEqual([]);
  });

  it("does not sync when another worker holds the lock", async () => {
    vi.mocked(redisCommand).mockResolvedValue(null);
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(await syncInstagramFeed()).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});
