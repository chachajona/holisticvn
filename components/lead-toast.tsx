"use client";

import { Toaster, toast } from "sonner";
import styles from "./lead-toast.module.css";

export function LeadToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      containerAriaLabel="Thông báo"
      offset={{ top: 96 }}
      mobileOffset={{ top: 80, left: 16, right: 16 }}
      toastOptions={{
        className: styles.toast,
        closeButtonAriaLabel: "Đóng thông báo",
      }}
    />
  );
}

// A shared id makes repeat submissions replace the previous result instead of stacking.
const toastId = "lead-result";

export const leadToast = {
  success: (message: string) => toast.success(message, { id: toastId, duration: 10_000 }),
  // Errors stay until dismissed: the visitor needs the direct call link before they leave.
  error: (message: string, phone: string) =>
    toast.error(
      <>
        {message}{" "}
        <a className={styles.call} href={`tel:${phone.replaceAll(" ", "")}`}>
          Gọi Holistic
        </a>
      </>,
      { id: toastId, duration: Infinity, closeButton: true },
    ),
};
