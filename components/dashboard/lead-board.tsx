"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import type { DashboardUser } from "@/lib/auth";

type Lead = {
  id: string;
  kind: "contact" | "booking";
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  treatment_name: string | null;
  source: string;
  status: "new" | "contacted" | "confirmed" | "completed" | "lost";
  assigned_to: string | null;
  created_at: string;
  profiles?: { full_name: string | null } | null;
};
const statuses = ["new", "contacted", "confirmed", "completed", "lost"] as const;
const labels: Record<Lead["status"], string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  confirmed: "Đã xác nhận",
  completed: "Hoàn tất",
  lost: "Không thành",
};

async function fetchLeads(filter: string, search: string, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("status", filter);
  if (search) params.set("q", search);
  const response = await fetch(`/api/dashboard/leads?${params}`, { signal });
  const data = await response.json();
  return { response, data };
}

export function LeadBoard({ user }: { user: DashboardUser }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [team, setTeam] = useState<{ id: string; full_name: string | null; role: string }[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loadedFilter, setLoadedFilter] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const loading = refreshing || loadedFilter !== filter;
  // Typing filters the current list; status changes request the latest search snapshot.
  const getSearch = useEffectEvent(() => search);
  const load = async () => {
    setRefreshing(true);
    try {
      const { response, data } = await fetchLeads(filter, search);
      if (response.ok) setLeads(data.leads);
      else setNotice(data.error || "Không thể tải lead");
      setLoadedFilter(filter);
    } catch {
      setNotice("Không thể tải lead");
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    void fetchLeads(filter, getSearch(), controller.signal)
      .then(({ response, data }) => {
        if (controller.signal.aborted) return;
        if (response.ok) setLeads(data.leads);
        else setNotice(data.error || "Không thể tải lead");
        setLoadedFilter(filter);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setNotice("Không thể tải lead");
          setLoadedFilter(filter);
        }
      });
    return () => controller.abort();
  }, [filter]);
  useEffect(() => {
    if (user.role !== "admin") return;
    void fetch("/api/dashboard/team")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setTeam(data?.members || []));
  }, [user.role]);
  const filtered = useMemo(
    () =>
      leads.filter(
        (lead) =>
          !search || `${lead.name} ${lead.phone}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [leads, search],
  );
  const update = async (id: string, changes: Record<string, string | null>) => {
    const response = await fetch("/api/dashboard/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...changes }),
    });
    if (!response.ok) {
      const data = await response.json();
      setNotice(data.error || "Không thể cập nhật");
      return;
    }
    setSelected(null);
    await load();
  };
  const exportCsv = () => {
    const rows = [
      ["Tên", "SĐT", "Loại", "Trạng thái", "Ngày tạo"],
      ...filtered.map((item) => [
        item.name,
        item.phone,
        item.kind,
        labels[item.status],
        new Date(item.created_at).toLocaleString("vi-VN"),
      ]),
    ];
    const blob = new Blob(
      [
        rows
          .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
          .join("\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `holisticvn-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <section className="dashboard__content">
      <div className="dashboard__intro">
        <div>
          <p className="eyebrow">CRM</p>
          <h1 className="display">Lead cần sự chú ý.</h1>
        </div>
        <button className="button button--light" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
      <div className="dashboard__filters">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm tên hoặc số điện thoại"
        />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          {statuses.map((status) => (
            <option value={status} key={status}>
              {labels[status]}
            </option>
          ))}
        </select>
      </div>
      {notice ? <p className="form-message">{notice}</p> : null}
      <div className="lead-table">
        <div className="lead-table__head">
          <span>Khách hàng</span>
          <span>Loại</span>
          <span>Trạng thái</span>
          <span>Phụ trách</span>
          <span>Thời gian</span>
        </div>
        {loading ? (
          <p>Đang tải…</p>
        ) : filtered.length ? (
          filtered.map((lead) => (
            <button className="lead-row" key={lead.id} onClick={() => setSelected(lead)}>
              <span>
                <b>{lead.name}</b>
                <small>{lead.phone}</small>
              </span>
              <span>{lead.kind === "booking" ? "Đặt lịch" : "Liên hệ"}</span>
              <span className={`status status--${lead.status}`}>{labels[lead.status]}</span>
              <span>{lead.profiles?.full_name || "Chưa phân công"}</span>
              <time>{new Date(lead.created_at).toLocaleDateString("vi-VN")}</time>
            </button>
          ))
        ) : (
          <p>Chưa có lead phù hợp.</p>
        )}
      </div>
      {selected ? (
        <LeadDrawer
          lead={selected}
          team={team}
          user={user}
          onClose={() => setSelected(null)}
          onUpdate={update}
        />
      ) : null}
    </section>
  );
}

function LeadDrawer({
  lead,
  team,
  user,
  onClose,
  onUpdate,
}: {
  lead: Lead;
  team: { id: string; full_name: string | null; role: string }[];
  user: DashboardUser;
  onClose: () => void;
  onUpdate: (id: string, changes: Record<string, string | null>) => Promise<void>;
}) {
  const [status, setStatus] = useState(lead.status);
  const [assignedTo, setAssignedTo] = useState(lead.assigned_to || "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    await onUpdate(lead.id, {
      status,
      ...(user.role === "admin" ? { assignedTo: assignedTo || null } : {}),
      ...(note ? { note } : {}),
    });
    setSaving(false);
  };
  return (
    <aside className="lead-drawer" role="dialog" aria-modal="true" aria-label="Chi tiết lead">
      <button className="lead-drawer__close" onClick={onClose}>
        ×
      </button>
      <p className="eyebrow">{lead.kind === "booking" ? "Đặt lịch" : "Liên hệ"}</p>
      <h2 className="display">{lead.name}</h2>
      <a href={`tel:${lead.phone}`}>{lead.phone}</a>
      {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : null}
      {lead.treatment_name ? (
        <p>
          <b>Liệu pháp:</b> {lead.treatment_name}
        </p>
      ) : null}
      <p className="lead-drawer__message">{lead.message || "Không có ghi chú từ khách hàng."}</p>
      <label>
        Trạng thái
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as Lead["status"])}
        >
          {statuses.map((value) => (
            <option key={value} value={value}>
              {labels[value]}
            </option>
          ))}
        </select>
      </label>
      {user.role === "admin" ? (
        <label>
          Phân công
          <select value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
            <option value="">Chưa phân công</option>
            {team
              .filter((member) => member.role === "staff")
              .map((member) => (
                <option value={member.id} key={member.id}>
                  {member.full_name || "Staff"}
                </option>
              ))}
          </select>
        </label>
      ) : null}
      <label>
        Ghi chú nội bộ
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          placeholder="Ghi lại bước tiếp theo…"
        />
      </label>
      <button className="button" disabled={saving} onClick={() => void submit()}>
        {saving ? "Đang lưu…" : "Lưu cập nhật"}
      </button>
      {user.role === "staff" ? <small>Lead này được hiển thị theo phân công của bạn.</small> : null}
    </aside>
  );
}
