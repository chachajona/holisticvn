// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

import { HeroQuickConsult } from "@/components/hero-quick-consult";

let root: Root;
let host: HTMLElement;
const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("fetch", fetchMock);
  host = document.body.appendChild(document.createElement("div"));
  root = createRoot(host);
  act(() => root.render(<HeroQuickConsult hours="09:00 — 21:00" phone="082 895 9598" />));
});

afterEach(() => {
  act(() => root.unmount());
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  fetchMock.mockReset();
});

const phone = () => host.querySelector<HTMLInputElement>('[name="phone"]')!;
const fillPhone = (value: string) => {
  const input = phone();
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

it("keeps a linked phone error visible beyond the old toast timeout and focuses after it renders", async () => {
  vi.useFakeTimers();
  const descriptionsAtFocus: (string | null | undefined)[] = [];
  phone().addEventListener("focus", () => {
    const describedBy = phone().getAttribute("aria-describedby");
    descriptionsAtFocus.push(
      describedBy ? document.getElementById(describedBy)?.textContent : null,
    );
  });
  fillPhone("12");
  await submit();

  expect(fetchMock).not.toHaveBeenCalled();
  expect(phone().getAttribute("aria-invalid")).toBe("true");
  const errorId = phone().getAttribute("aria-describedby");
  expect(errorId).toBeTruthy();
  expect(document.getElementById(errorId!)?.textContent).toBe("Số điện thoại chưa hợp lệ");
  expect(host.querySelector('[role="alert"]')?.textContent).toBe("Số điện thoại chưa hợp lệ");
  expect(document.activeElement).toBe(phone());
  expect(descriptionsAtFocus).toEqual(["Số điện thoại chưa hợp lệ"]);
  expect(toast.error).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(7_000));
  expect(document.getElementById(errorId!)?.textContent).toBe("Số điện thoại chưa hợp lệ");
});

it("clears corrected phone feedback without moving focus and can focus a repeated invalid submission", async () => {
  fillPhone("12");
  await submit();
  const button = host.querySelector("button")!;
  button.focus();
  await submit();
  expect(document.activeElement).toBe(phone());

  button.focus();
  fillPhone("0901234567");
  expect(phone().hasAttribute("aria-invalid")).toBe(false);
  expect(phone().hasAttribute("aria-describedby")).toBe(false);
  expect(host.querySelector('[role="alert"]')?.textContent).toBe("");
  expect(document.activeElement).toBe(button);
});

it("submits once after correction, preserves the quick-consult context and resets on success", async () => {
  let release!: (response: Response) => void;
  fetchMock.mockReturnValue(new Promise<Response>((resolve) => (release = resolve)));
  fillPhone("12");
  await submit();
  fillPhone("0901234567");
  await submit();
  await submit();

  expect(fetchMock).toHaveBeenCalledOnce();
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
    kind: "contact",
    name: "Khách tư vấn nhanh",
    phone: "0901234567",
    source: "home-hero",
  });
  expect(host.querySelector("button")!.disabled).toBe(true);

  await act(async () => release(new Response("{}", { status: 200 })));
  expect(phone().value).toBe("");
  expect(host.querySelector("button")!.disabled).toBe(false);
  expect(host.querySelector('[role="alert"]')?.textContent).toBe("");
  expect(toast.success).toHaveBeenCalledOnce();
});
