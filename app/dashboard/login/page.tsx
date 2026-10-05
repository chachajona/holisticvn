"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function DashboardLoginPage() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setLoading(true); setError(""); const data = new FormData(event.currentTarget); const supabase = createBrowserSupabaseClient(); if (!supabase) { setError("Supabase chưa được cấu hình."); setLoading(false); return; } const { error: authError } = await supabase.auth.signInWithPassword({ email: String(data.get("email")), password: String(data.get("password")) }); if (authError) { setError("Email hoặc mật khẩu chưa đúng."); setLoading(false); return; } router.replace("/dashboard"); router.refresh(); };
  return <main className="dashboard-login"><div><p className="eyebrow">HolisticVN · Nội bộ</p><h1 className="display">Chào mừng trở lại.</h1><p>Đăng nhập để xử lý lead và cập nhật hành trình của khách hàng.</p><form onSubmit={submit}><label>Email<input required type="email" name="email" /></label><label>Mật khẩu<input required type="password" name="password" /></label><button className="button" disabled={loading}>{loading ? "Đang đăng nhập…" : "Đăng nhập"}</button>{error ? <p className="form-message">{error}</p> : null}</form></div></main>;
}
