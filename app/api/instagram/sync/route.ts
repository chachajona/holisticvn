import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { syncInstagramFeed } from "@/lib/instagram";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const provided = Buffer.from(request.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret || ""}`);
  if (!secret || provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const synced = await syncInstagramFeed();
    if (synced) revalidatePath("/");
    return Response.json({ synced }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.warn("Instagram scheduled sync failed; check the connection and Redis.");
    return Response.json({ error: "Instagram sync unavailable" }, { status: 503 });
  }
}
