"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "error" | "success";

export function ContactForm() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const initialTopic =
    topic === "event"
      ? "Submit an event"
      : topic === "collection"
        ? "Feature a collection"
        : topic === "partnership"
          ? "Partnership"
          : "General question";
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("We usually reply within two business days.");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setState("error");
      setMessage("Complete the required fields and check your email address.");
      form.reportValidity();
      return;
    }

    setState("submitting");
    setMessage("Sending your message…");
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/forms/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "We could not send the message.");
      setState("success");
      setMessage("Message received. We will get back to you soon.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not send the message. Please try again.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-field"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required /></div>
      <div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="form-field form-field--full"><label htmlFor="topic">What can we help with?</label><select id="topic" name="topic" defaultValue={initialTopic}><option>General question</option><option>Submit an event</option><option>Feature a collection</option><option>Partnership</option><option>Press</option></select></div>
      <div className="form-field form-field--full"><label htmlFor="url">Relevant link <span>Optional</span></label><input id="url" name="url" type="url" placeholder="https://" /></div>
      <div className="form-field form-field--full"><label htmlFor="message">Message</label><textarea id="message" name="message" rows={7} required /></div>
      <div className="honeypot-field" hidden><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="form-field--full"><button className="button button--yellow" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Sending…" : "Send message"}</button><p className={`form-message form-message--${state}`} aria-live="polite">{message}</p></div>
    </form>
  );
}
