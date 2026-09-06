"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, LockKey } from "@phosphor-icons/react";

export function CmsLogin({ setupMessage }: { setupMessage?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(setupMessage ?? "");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/cms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setMessage(result.error ?? "Unable to sign in.");
        return;
      }
      window.location.reload();
    } catch {
      setMessage("The CMS could not be reached. Try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="cms-login" id="main-content">
      <div className="cms-login__shell">
        <section className="cms-login__intro">
          <Link href="/" className="cms-login__logo" aria-label="Back to Hobby Trail"><Image src="/assets/brand/logo-wordmark.png" alt="Hobby Trail" width={973} height={408} /></Link>
          <div><p className="detail-kicker">Private workspace</p><h1>Keep the trail current.</h1><p>Manage events, collections, guides, partners, and community stories from one focused workspace.</p></div>
          <p className="cms-login__location">Hobby Trail · Melbourne, Australia</p>
        </section>
        <section className="cms-login__card" aria-labelledby="cms-login-title">
          <span className="cms-login__lock" aria-hidden="true"><LockKey size={24} weight="fill" /></span>
          <p className="detail-kicker">Admin access</p>
          <h2 id="cms-login-title">Sign in to continue</h2>
          <p>Use an approved Hobby Trail administrator account.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="cms-email">Email address</label>
            <input id="cms-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} autoFocus required />
            <label htmlFor="cms-password">Password</label>
            <input id="cms-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {message && <p className="cms-form-message" role="alert">{message}</p>}
            <button className="button button--yellow" type="submit" disabled={pending}>{pending ? "Checking access…" : "Sign in"}</button>
          </form>
          <Link className="cms-login__back" href="/"><ArrowLeft size={16} weight="bold" /> Back to website</Link>
        </section>
      </div>
    </main>
  );
}
