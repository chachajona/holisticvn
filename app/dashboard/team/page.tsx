"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Member = { id: string; full_name: string | null; role: string; created_at: string };
async function fetchTeam(signal?: AbortSignal) {
  const response = await fetch("/api/dashboard/team", { signal });
  const data = await response.json();
  return { response, data };
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const applyTeam = useCallback(({ response, data }: Awaited<ReturnType<typeof fetchTeam>>) => {
    if (response.ok) setMembers(data.members);
    else setNotice(data.error || "Không thể tải đội ngũ");
    setLoading(false);
  }, []);
  const load = () => fetchTeam().then(applyTeam);
  useEffect(() => {
    const controller = new AbortController();
    void fetchTeam(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) applyTeam(result);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setNotice("Không thể tải đội ngũ");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [applyTeam]);
  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/dashboard/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: form.get("fullName"), email: form.get("email") }),
    });
    const data = await response.json();
    if (!response.ok) {
      setNotice(data.error || "Không thể gửi lời mời");
      return;
    }
    setNotice("Đã gửi lời mời qua email.");
    formElement.reset();
    await load();
  };
  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <Link href="/" className="display">
          HolisticVN
        </Link>
        <Link href="/dashboard">← Lead</Link>
      </header>
      <section className="dashboard__content team">
        <div className="dashboard__intro">
          <div>
            <p className="eyebrow">Quản trị</p>
            <h1 className="display">Đội ngũ.</h1>
          </div>
        </div>
        <div className="team__grid">
          <form className="lead-form" onSubmit={invite}>
            <h2 className="display">Mời Staff</h2>
            <label>
              Họ và tên
              <input name="fullName" required minLength={2} />
            </label>
            <label>
              Email công việc
              <input name="email" required type="email" />
            </label>
            <button className="button">Gửi lời mời</button>
            {notice ? <p className="form-message">{notice}</p> : null}
          </form>
          <div className="team__list">
            <h2 className="display">Thành viên</h2>
            {loading ? (
              <p>Đang tải…</p>
            ) : (
              members.map((member) => (
                <div key={member.id}>
                  <span>{member.full_name || "Chưa đặt tên"}</span>
                  <small>{member.role === "admin" ? "Admin" : "Staff"}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
