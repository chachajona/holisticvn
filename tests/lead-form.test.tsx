// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));
vi.mock("@/components/site-data", () => ({
  useSiteData: () => ({ site: { phone: "082 895 9598" } }),
}));

import { LeadForm } from "@/components/lead-form";

let root: Root;
let host: HTMLElement;
const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("fetch", fetchMock);
  host = document.body.appendChild(document.createElement("div"));
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  fetchMock.mockReset();
});

const field = (name: string) => host.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
const fill = (name: string, value: string) => {
  const input = field(name);
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  setter.call(input, value);
  act(() => {
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
};
const submit = () =>
  act(async () => {
    host
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
const render = (kind: "contact" | "booking" = "booking") =>
  act(() => root.render(<LeadForm kind={kind} treatment="Giác hơi" />));

it("shows inline errors, focuses the first invalid field and sends nothing", async () => {
  render();
  fill("phone", "12");
  await submit();
  expect(fetchMock).not.toHaveBeenCalled();
  expect(field("name").getAttribute("aria-invalid")).toBe("true");
  expect(host.textContent).toContain("Vui lòng nhập họ tên");
  expect(host.textContent).toContain("Số điện thoại chưa hợp lệ");
  expect(document.activeElement).toBe(field("name"));
  const described = field("phone").getAttribute("aria-describedby")!;
  expect(document.getElementById(described)?.textContent).toBe("Số điện thoại chưa hợp lệ");
  fill("name", "An");
  expect(field("name").getAttribute("aria-invalid")).toBeNull();
});

it("keeps the entered data and offers the call link when the network fails", async () => {
  fetchMock.mockRejectedValue(new TypeError("offline"));
  render();
  fill("name", "An");
  fill("phone", "0828 959 598");
  await submit();
  expect(field("name").value).toBe("An");
  expect(field("phone").value).toBe("0828 959 598");
  expect(toast.error).toHaveBeenCalledOnce();
  expect(host.querySelector("button")!.disabled).toBe(false);
});

it("sends the treatment and confirms with a callback message", async () => {
  fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
  render();
  fill("name", "An");
  fill("phone", "0828 959 598");
  await submit();
  const body = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(body).toMatchObject({ kind: "booking", treatment: "Giác hơi", name: "An" });
  expect(toast.success.mock.calls[0][0]).toContain("Holistic sẽ gọi lại");
  expect(field("name").value).toBe("");
});

it("ignores a second submit while the first is pending", async () => {
  let release!: (response: Response) => void;
  fetchMock.mockReturnValue(new Promise<Response>((resolve) => (release = resolve)));
  render();
  fill("name", "An");
  fill("phone", "0828 959 598");
  await submit();
  await submit();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(host.querySelector("button")!.disabled).toBe(true);
  await act(async () => release(new Response("{}", { status: 200 })));
});
