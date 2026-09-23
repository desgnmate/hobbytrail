"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, LockSimple, ShieldCheck } from "@phosphor-icons/react";

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
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setMessage(result.error ?? "Invalid credentials or unauthorized account.");
        return;
      }
      window.location.reload();
    } catch {
      setMessage("Connection error: Unable to reach the CMS auth endpoint.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="cms-login-page" id="main-content">
      <div className="cms-login-container">
        {/* Brand Header */}
        <div className="cms-login-header">
          <div className="cms-login-badge">
            <ShieldCheck size={24} weight="fill" />
          </div>
          <h1 className="cms-login-title">Hobby Trail CMS</h1>
          <p className="cms-login-subtitle">Sign in with an authorized administrator account to manage events, content, and site settings.</p>
        </div>

        {/* Login Card */}
        <div className="cms-login-card">
          {message && (
            <div className="cms-login-alert" role="alert">
              <LockSimple size={16} weight="bold" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="cms-login-form">
            <div className="cms-login-field">
              <label htmlFor="cms-email">Email address</label>
              <input
                id="cms-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                autoFocus
                placeholder="admin@hobbytrail.com.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="cms-login-field">
              <div className="cms-login-label-row">
                <label htmlFor="cms-password">Password</label>
              </div>
              <input
                id="cms-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="cms-login-submit" disabled={pending}>
              {pending ? "Authenticating…" : "Sign in to Dashboard"}
            </button>
          </form>

          <div className="cms-login-footer">
            <Link href="/" className="cms-login-back-link">
              <ArrowLeft size={15} weight="bold" />
              <span>Back to public website</span>
            </Link>
          </div>
        </div>

        <p className="cms-login-security-notice">
          Authorized personnel only. Sessions are encrypted and rate-limited.
        </p>
      </div>
    </div>
  );
}
