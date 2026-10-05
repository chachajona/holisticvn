import { NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/email";
import { leadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const result = leadSchema.safeParse(await request.json().catch(() => null));
  if (!result.success)
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Dữ liệu chưa hợp lệ" },
      { status: 400 },
    );
  const input = result.data;
  if (input.website) return NextResponse.json({ success: true });
  const delivery = await sendLeadNotification(input);
  if (!delivery.ok) {
    return NextResponse.json(
      { error: "Chưa thể gửi yêu cầu. Vui lòng gọi Holistic để được hỗ trợ." },
      { status: delivery.reason === "unconfigured" ? 503 : 502 },
    );
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
