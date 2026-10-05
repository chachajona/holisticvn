import Link from "next/link";
import { redirect } from "next/navigation";
import { LeadBoard } from "@/components/dashboard/lead-board";
import { getDashboardUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export default async function DashboardPage() { const user = await getDashboardUser(); if (!user) redirect("/dashboard/login"); return <main className="dashboard"><header className="dashboard__header"><Link href="/" className="display">HolisticVN</Link><div><span>{user.fullName || user.email} · {user.role === "admin" ? "Admin" : "Staff"}</span>{user.role === "admin" ? <Link href="/dashboard/team">Đội ngũ</Link> : null}</div></header><LeadBoard user={user} /></main>; }
