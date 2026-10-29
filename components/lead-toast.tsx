import { toast } from "sonner";

// One id per kind so a repeat submit replaces the previous toast instead of stacking.
const id = "lead-result";

export const leadToast = {
  success: (text: string) => toast.success(text, { id, duration: 10_000 }),
  // Errors stay until dismissed: the visitor needs the direct call link before they leave.
  error: (message: string, phone: string) =>
    toast.error(
      <>
        {message} <a href={`tel:${phone.replaceAll(" ", "")}`}>Gọi Holistic</a>
      </>,
      { id, duration: Infinity, closeButton: true },
    ),
  // Field-level problems are fixable in place, so they time out.
  invalid: (message: string) => toast.error(message, { id, duration: 6000 }),
};
