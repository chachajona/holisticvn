import { NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/email";
import { leadSchema } from "@/lib/validation";
import { checkLeadRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(request: Request) {
  const result = leadSchema.safeParse(await request.json().catch(() => null));
  if (!result.success)
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Dữ liệu chưa hợp lệ" },
      { status: 400 },
    );
  const input = result.data;
  if (input.website) return NextResponse.json({ success: true });
  const limit = await checkLeadRateLimit(input.phone);
  if (limit !== "allowed")
    return NextResponse.json(
      {
        error:
          limit === "limited"
            ? "Đã nhận nhiều yêu cầu. Vui lòng thử lại sau hoặc gọi Holistic."
            : "Chưa thể gửi yêu cầu. Vui lòng gọi Holistic để được hỗ trợ.",
      },
      {
        status: limit === "limited" ? 429 : 503,
        ...(limit === "limited" ? { headers: { "Retry-After": "3600" } } : {}),
      },
    );
  const delivery = await sendLeadNotification(input);
  if (!delivery.ok) {
    return NextResponse.json(
      { error: "Chưa thể gửi yêu cầu. Vui lòng gọi Holistic để được hỗ trợ." },
      { status: delivery.reason === "unconfigured" ? 503 : 502 },
    );
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
