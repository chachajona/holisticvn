"use client";

import { FormEvent, useState } from "react";
import { track } from "@/components/gtm";

export function NewsletterForm() {
  const [message, setMessage] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), website: form.get("website") }) });
    if (response.ok) { setMessage("Bạn đã đăng ký nhận tin."); track("newsletter_submit"); event.currentTarget.reset(); } else setMessage("Chưa thể đăng ký lúc này. Vui lòng thử lại sau.");
  };
  return <form className="newsletter-form" onSubmit={submit}><input className="honeypot" name="website" tabIndex={-1} aria-hidden="true" /><input name="email" type="email" required placeholder="Email của bạn" aria-label="Email của bạn" /><button className="button">Đăng ký <span>→</span></button>{message ? <p>{message}</p> : null}</form>;
}
