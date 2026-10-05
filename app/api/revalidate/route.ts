import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-sanity-secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Includes detail routes, shared contact settings, and sitemap after edits/deletions.
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ revalidated: true });
}
