import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const result = newsletterSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) return NextResponse.json({ error: result.error.issues[0]?.message || "Dữ liệu chưa hợp lệ" }, { status: 400 });
  if (result.data.website) return NextResponse.json({ success: true });
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Hệ thống đang cần được cấu hình" }, { status: 503 });
  const { error } = await supabase.from("newsletter_subscribers").upsert({ email: result.data.email, status: "subscribed" }, { onConflict: "email" });
  if (error) return NextResponse.json({ error: "Không thể đăng ký lúc này" }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
