import { NextResponse } from "next/server";
import { getDashboardUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { leadUpdateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const user = await getDashboardUser();
  const supabase = await createServerSupabaseClient();
  if (!user || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const kind = searchParams.get("kind");
  const q = searchParams.get("q")?.trim();
  let query = supabase
    .from("leads")
    .select(
      "id,kind,name,phone,email,message,treatment_name,source,status,assigned_to,created_at,updated_at,profiles:assigned_to(full_name)",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (status) query = query.eq("status", status);
  if (kind) query = query.eq("kind", kind);
  if (q)
    query = query.or(
      `name.ilike.%${q.replaceAll("%", "\\%")}%,phone.ilike.%${q.replaceAll("%", "\\%")}%`,
    );
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Không thể tải lead" }, { status: 500 });
  return NextResponse.json({ leads: data, role: user.role });
}

export async function PATCH(request: Request) {
  const user = await getDashboardUser();
  const supabase = await createServerSupabaseClient();
  if (!user || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = body?.id as string | undefined;
  const parsed = leadUpdateSchema.safeParse(body);
  if (!id || !parsed.success)
    return NextResponse.json({ error: "Dữ liệu chưa hợp lệ" }, { status: 400 });
  const { note, assignedTo, ...update } = parsed.data;
  if (assignedTo !== undefined && user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (Object.keys(update).length || assignedTo !== undefined) {
    const { error } = await supabase
      .from("leads")
      .update({ ...update, ...(assignedTo !== undefined ? { assigned_to: assignedTo } : {}) })
      .eq("id", id);
    if (error) return NextResponse.json({ error: "Không thể cập nhật lead" }, { status: 500 });
  }
  if (note) {
    const { error } = await supabase
      .from("lead_notes")
      .insert({ lead_id: id, author_id: user.id, body: note });
    if (error) return NextResponse.json({ error: "Không thể thêm ghi chú" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
