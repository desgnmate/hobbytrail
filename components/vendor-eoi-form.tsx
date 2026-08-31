"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "error" | "success";

export function VendorEoiForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("Submitting an expression of interest does not guarantee a booth. The event team will review each application.");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setState("error");
      setMessage("Complete the required fields before submitting.");
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    setState("submitting");
    setMessage("Sending your expression of interest…");

    try {
      const response = await fetch("/api/forms/vendor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, consent: formData.get("consent") === "on" }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "We could not send the application.");
      setState("success");
      setMessage("Your expression of interest has been received. The event team will contact you after review.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not send the application. Please try again.");
    }
  }

  return (
    <form className="vendor-form" onSubmit={submit} noValidate>
      <div className="form-field"><label htmlFor="vendor-name">Contact name</label><input id="vendor-name" name="name" autoComplete="name" required /></div>
      <div className="form-field"><label htmlFor="vendor-email">Email address</label><input id="vendor-email" name="email" type="email" autoComplete="email" required /></div>
      <div className="form-field"><label htmlFor="vendor-business">Business or creator name</label><input id="vendor-business" name="businessName" autoComplete="organization" required /></div>
      <div className="form-field"><label htmlFor="vendor-phone">Phone number <span>Optional</span></label><input id="vendor-phone" name="phone" type="tel" autoComplete="tel" /></div>
      <div className="form-field"><label htmlFor="vendor-category">What will you exhibit?</label><select id="vendor-category" name="category" required defaultValue=""><option value="" disabled>Select a category</option><option>Trading cards and TCG products</option><option>Collectibles and toys</option><option>Gaming</option><option>Creator art and merchandise</option><option>Accessories and supplies</option><option>Food and beverage</option><option>Other</option></select></div>
      <div className="form-field"><label htmlFor="vendor-space">Preferred space</label><select id="vendor-space" name="space" required defaultValue=""><option value="" disabled>Select a space</option><option>Standard table</option><option>Double table</option><option>Creator booth</option><option>Custom footprint</option><option>Unsure</option></select></div>
      <div className="form-field form-field--full"><label htmlFor="vendor-url">Website or social profile <span>Optional</span></label><input id="vendor-url" name="portfolioUrl" type="url" placeholder="https://" /></div>
      <div className="form-field form-field--full"><label htmlFor="vendor-message">Tell us about your offer and event experience</label><textarea id="vendor-message" name="message" rows={7} required /></div>
      <div className="honeypot-field" hidden><label htmlFor="vendor-website">Leave this field empty</label><input id="vendor-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <label className="consent-field form-field--full"><input type="checkbox" name="consent" required /><span>I agree that Hobby Trail may use these details to assess this application and contact me about event participation. See the <Link href="/privacy">privacy policy</Link>.</span></label>
      <div className="form-field--full"><button className="button button--yellow" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Submitting…" : "Submit vendor EOI"}</button><p className={`form-message form-message--${state}`} aria-live="polite">{message}</p></div>
    </form>
  );
}
