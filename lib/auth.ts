import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Role = "admin" | "staff";
export type DashboardUser = { id: string; email: string; fullName: string | null; role: Role };

export async function getDashboardUser(): Promise<DashboardUser | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || (profile.role !== "admin" && profile.role !== "staff")) return null;
  return { id: user.id, email: user.email ?? "", fullName: profile.full_name, role: profile.role };
}
