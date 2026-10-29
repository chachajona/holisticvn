import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^(?:\+84|0)[\d\s.-]{8,15}$/, "Số điện thoại chưa hợp lệ")
  .refine((value) => value.replace(/\D/g, "").length >= 10, "Số điện thoại chưa hợp lệ");

export const leadSchema = z.object({
  kind: z.enum(["contact", "booking"]),
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100, "Họ tên tối đa 100 ký tự"),
  phone,
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: "Email chưa hợp lệ" }))
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(1000, "Ghi chú tối đa 1000 ký tự").optional().or(z.literal("")),
  treatment: z.string().trim().max(120, "Tên liệu pháp quá dài").optional().or(z.literal("")),
  source: z.string().trim().max(200, "Dữ liệu chưa hợp lệ").optional().default("website"),
  website: z.string().optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
