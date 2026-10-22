import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-sanity-secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Expire shared CMS data before regenerating pages and the sitemap after edits/deletions.
  revalidateTag("sanity", { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ revalidated: true });
}
