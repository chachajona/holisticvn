import { NextResponse } from "next/server";
import { getDashboardUser } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const inviteSchema = z.object({ email: z.string().email(), fullName: z.string().trim().min(2).max(100) });

export async function GET() {
  const user = await getDashboardUser(); const supabase = createServiceSupabaseClient();
  if (user?.role !== "admin" || !supabase) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { data, error } = await supabase.from("profiles").select("id,full_name,role,created_at").order("created_at");
  if (error) return NextResponse.json({ error: "Không thể tải đội ngũ" }, { status: 500 });
  return NextResponse.json({ members: data });
}

export async function POST(request: Request) {
  const user = await getDashboardUser(); const supabase = createServiceSupabaseClient();
  if (user?.role !== "admin" || !supabase) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = inviteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Thông tin nhân viên chưa hợp lệ" }, { status: 400 });
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const { error } = await supabase.auth.admin.inviteUserByEmail(parsed.data.email, { data: { full_name: parsed.data.fullName, role: "staff" }, redirectTo: `${origin}/dashboard/login` });
  if (error) return NextResponse.json({ error: "Không thể gửi lời mời" }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
