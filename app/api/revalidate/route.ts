import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-sanity-secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  ["/", "/services", "/treatments", "/blog", "/about"].forEach((path) => revalidatePath(path));
  return NextResponse.json({ revalidated: true });
}
