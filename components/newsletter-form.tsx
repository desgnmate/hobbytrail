"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [message, setMessage] = useState("Useful updates only. Unsubscribe whenever you like.");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setState("submitting");
    setMessage("Adding you to the trail…");
    try {
      const response = await fetch("/api/forms/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, website: data.get("website") }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "We could not complete the subscription.");
      setState("success");
      setMessage("Subscription confirmed. Watch your inbox.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not complete the subscription. Please try again.");
    }
  }

  return (
    <form className="newsletter-form" onSubmit={submit} noValidate>
      <label htmlFor="newsletter-email">Email address</label>
      <div className="newsletter-form__row">
        <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-describedby="newsletter-message" />
        <button className="button button--black" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Submitting…" : "Subscribe"}</button>
      </div>
      <div className="honeypot-field" hidden><label htmlFor="newsletter-website">Website</label><input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <p id="newsletter-message" className={`form-message form-message--${state}`} aria-live="polite">
        {message}
      </p>
    </form>
  );
}
