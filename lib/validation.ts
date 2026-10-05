import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^(?:\+84|0)[\d\s.-]{8,15}$/, "Số điện thoại chưa hợp lệ")
  .refine((value) => value.replace(/\D/g, "").length >= 10, "Số điện thoại chưa hợp lệ");

export const leadSchema = z.object({
  kind: z.enum(["contact", "booking"]),
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100),
  phone,
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: "Email chưa hợp lệ" }))
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  treatment: z.string().trim().max(120).optional().or(z.literal("")),
  branch: z.enum(["ban-co", "xom-chieu"]).optional().or(z.literal("")),
  source: z.string().trim().max(200).optional().default("website"),
  website: z.string().optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
