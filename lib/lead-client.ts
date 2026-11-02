import { leadSchema, type LeadPayload } from "@/lib/validation";

export type { LeadPayload } from "@/lib/validation";
export type LeadErrors = Partial<Record<string, string>>;
export type LeadResult = { ok: true } | { ok: false; message: string };

// Same schema as /api/leads, so client and server reject the same input with the same copy.
export function validateLead(payload: unknown): LeadErrors {
  const result = leadSchema.safeParse(payload);
  if (result.success) return {};
  const errors: LeadErrors = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "");
    errors[field] ??= issue.message;
  }
  return errors;
}

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => null);
  if (!response)
    return {
      ok: false,
      message: "Chưa gửi được yêu cầu. Bạn kiểm tra kết nối mạng rồi thử lại.",
    };
  if (response.ok) return { ok: true };
  const data = await response.json().catch(() => null);
  return {
    ok: false,
    message:
      typeof data?.error === "string" ? data.error : "Chưa gửi được yêu cầu. Vui lòng thử lại sau.",
  };
}
