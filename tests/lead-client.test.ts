import { afterEach, describe, expect, it, vi } from "vitest";
import { submitLead, validateLead } from "@/lib/lead-client";

const valid = { kind: "contact", name: "An", phone: "0828 959 598", email: "", message: "" };

afterEach(() => vi.unstubAllGlobals());

describe("validateLead", () => {
  it("accepts a valid lead", () => {
    expect(validateLead(valid)).toEqual({});
  });

  it("returns one Vietnamese message per invalid field", () => {
    const errors = validateLead({
      ...valid,
      name: "",
      phone: "12",
      email: "bad",
      message: "x".repeat(1001),
      treatment: "y".repeat(121),
    });
    expect(errors).toEqual({
      name: "Vui lòng nhập họ tên",
      phone: "Số điện thoại chưa hợp lệ",
      email: "Email chưa hợp lệ",
      message: "Ghi chú tối đa 1000 ký tự",
      treatment: "Tên liệu pháp quá dài",
    });
  });
});

describe("submitLead", () => {
  const respond = (status: number, body?: unknown) =>
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(body ?? {}), { status })),
    );

  it("reports success", async () => {
    respond(200, { success: true });
    expect(await submitLead(valid)).toEqual({ ok: true });
  });

  it.each([429, 502, 503])("surfaces the server message on %i", async (status) => {
    respond(status, { error: "Vui lòng gọi Holistic." });
    expect(await submitLead(valid)).toEqual({ ok: false, message: "Vui lòng gọi Holistic." });
  });

  it("falls back when the error body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<html>", { status: 502 })),
    );
    expect(await submitLead(valid)).toEqual({
      ok: false,
      message: "Chưa gửi được yêu cầu. Vui lòng thử lại.",
    });
  });

  it("reports a network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new TypeError("offline"))),
    );
    expect(await submitLead(valid)).toEqual({
      ok: false,
      message: "Không kết nối được. Vui lòng kiểm tra mạng.",
    });
  });
});
