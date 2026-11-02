import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BookingPanel } from "@/app/treatments/[slug]/booking-panel";
import { LeadForm } from "@/components/lead-form";

const find = (node: unknown): ReactElement<{ treatment?: string; kind?: string }> | undefined => {
  if (!node || typeof node !== "object") return undefined;
  const element = node as { type?: unknown; props?: { children?: unknown } };
  if (element.type === LeadForm) return element as never;
  return [element.props?.children].flat(Infinity).map(find).find(Boolean);
};

describe("BookingPanel", () => {
  it("hands the treatment title to the callback form", () => {
    const form = find(BookingPanel({ title: "Giác hơi" }));
    expect(form?.props).toMatchObject({
      kind: "booking",
      treatment: "Giác hơi",
      submitLabel: "Gọi lại cho tôi",
      successMessage: "Đã gửi yêu cầu. Holistic sẽ gọi lại để tư vấn và xác nhận lịch hẹn.",
    });
  });

  it("is the anchor target with the approved wording and no booking promise", () => {
    const html = renderToStaticMarkup(<BookingPanel title="Giác hơi" />);
    expect(html).toContain('id="yeu-cau"');
    expect(html).toContain("Bạn cần trao đổi thêm?");
    expect(html).toContain(
      "Để lại số điện thoại. Holistic sẽ gọi lại để trao đổi và xác nhận lịch hẹn với bạn.",
    );
  });
});
