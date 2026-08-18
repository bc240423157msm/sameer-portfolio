"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff, Mail, ShieldCheck, KeyRound } from "lucide-react";
import { Container } from "@/components/layout/Container";

type Step =
  | "credentials"
  | "choose-method"
  | "email-code"
  | "totp-setup"
  | "totp-code";

const codeInputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-3 text-center text-lg tracking-[0.5em] text-text-primary placeholder:tracking-normal placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export default function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2FA state
  const [step, setStepRaw] = useState<Step>("credentials");
  // Always clear the entered code whenever we move to a different step,
  // instead of doing it as a side effect (avoids cascading renders).
  const setStep = (next: Step) => {
    setCode("");
    setStepRaw(next);
  };
  const [pendingToken, setPendingToken] = useState("");
  const [availableMethods, setAvailableMethods] = useState<("email" | "totp")[]>([]);
  const [totpSetupRequired, setTotpSetupRequired] = useState(false);
  const [code, setCode] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [emailSentMessage, setEmailSentMessage] = useState("");

  async function completeLogin(res: Response, data: { redirect?: string; error?: string }) {
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return false;
    }
    router.push(redirect || data.redirect || "/portal");
    router.refresh();
    return true;
  }

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      if (data.requires2FA) {
        setPendingToken(data.pendingToken);
        setAvailableMethods(data.availableMethods ?? []);
        setTotpSetupRequired(Boolean(data.totpSetupRequired));

        const methods: ("email" | "totp")[] = data.availableMethods ?? [];
        if (methods.length === 1) {
          if (methods[0] === "email") {
            setEmailSentMessage("We sent a 6-digit code to your email.");
            setStep("email-code");
          } else if (data.totpSetupRequired) {
            await beginTotpSetup(data.pendingToken);
          } else {
            setStep("totp-code");
          }
        } else {
          setStep("choose-method");
        }
        return;
      }

      await completeLogin(res, data);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function beginTotpSetup(token: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/totp-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingToken: token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not start authenticator setup.");
        return;
      }
      setQrDataUrl(data.qrDataUrl);
      setTotpSecret(data.secret);
      setStep("totp-setup");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function chooseMethod(method: "email" | "totp") {
    setError("");
    if (method === "email") {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/2fa/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pendingToken }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not send code.");
          return;
        }
        setEmailSentMessage("We sent a 6-digit code to your email.");
        setStep("email-code");
      } finally {
        setLoading(false);
      }
    } else if (totpSetupRequired) {
      await beginTotpSetup(pendingToken);
    } else {
      setStep("totp-code");
    }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const method = step === "totp-setup" ? "totp-setup" : step === "totp-code" ? "totp" : "email";
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingToken, code, method }),
      });
      const data = await res.json();
      await completeLogin(res, data);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendEmailCode() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingToken }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Could not resend code.");
      else setEmailSentMessage("A new code was sent to your email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-accent/8 blur-[100px]" />
      </div>

      <Container className="relative z-10 max-w-md">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {step === "credentials" ? <Lock className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
            </div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {step === "credentials" ? "Portal Access" : "Two-Factor Verification"}
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              {step === "credentials" && "Authorized access only"}
              {step === "choose-method" && "Choose how you'd like to verify it's you"}
              {step === "email-code" && emailSentMessage}
              {step === "totp-code" && "Enter the 6-digit code from your authenticator app"}
              {step === "totp-setup" && "Scan this QR code with your authenticator app"}
            </p>
          </div>

          {step === "credentials" && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pr-11 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    tabIndex={0}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-text-muted transition-colors hover:text-text-primary focus:outline-none focus:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-error/30 bg-error/10 px-4 py-2.5 text-sm text-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}

          {step === "choose-method" && (
            <div className="space-y-3">
              {availableMethods.includes("email") && (
                <button
                  onClick={() => chooseMethod("email")}
                  disabled={loading}
                  className="flex w-full items-center gap-3 rounded-lg border border-border px-4 py-3 text-left text-sm text-text-primary hover:border-primary/40 disabled:opacity-60"
                >
                  <Mail className="h-4 w-4 text-primary" /> Send code to my email
                </button>
              )}
              {availableMethods.includes("totp") && (
                <button
                  onClick={() => chooseMethod("totp")}
                  disabled={loading}
                  className="flex w-full items-center gap-3 rounded-lg border border-border px-4 py-3 text-left text-sm text-text-primary hover:border-primary/40 disabled:opacity-60"
                >
                  <KeyRound className="h-4 w-4 text-primary" /> Use authenticator app
                </button>
              )}
              {error && <p className="text-sm text-error">{error}</p>}
            </div>
          )}

          {(step === "email-code" || step === "totp-code" || step === "totp-setup") && (
            <form onSubmit={submitCode} className="space-y-5">
              {step === "totp-setup" && (
                <div className="space-y-3 text-center">
                  {qrDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrDataUrl} alt="Authenticator QR code" className="mx-auto h-44 w-44 rounded-lg bg-white p-2" />
                  )}
                  <p className="text-xs text-text-muted">
                    Can&apos;t scan? Enter this key manually:{" "}
                    <span className="break-all font-mono text-text-secondary">{totpSecret}</span>
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Verification code
                </label>
                <input
                  id="code"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className={codeInputClass}
                  placeholder="000000"
                  required
                  autoFocus
                />
              </div>

              {step === "email-code" && (
                <button
                  type="button"
                  onClick={resendEmailCode}
                  disabled={loading}
                  className="text-xs text-text-muted hover:text-primary"
                >
                  Didn&apos;t get it? Resend code
                </button>
              )}

              {error && (
                <p className="rounded-lg border border-error/30 bg-error/10 px-4 py-2.5 text-sm text-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Sign In"}
              </button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
