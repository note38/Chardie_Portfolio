"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { signIn, errors } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setLoading(true);
    setError("");

    try {
      // 1. Initialize sign-in
      const createRes = await signIn.create({ identifier: email });
      if (createRes.error) {
        throw createRes.error;
      }

      // 2. Submit password directly since v7 groups them sequentially
      const pwRes = await signIn.password({ password });
      if (pwRes.error) {
        throw pwRes.error;
      }

      // 3. Finalize if complete
      if (signIn.status === "complete") {
        const finalizeRes = await signIn.finalize();
        if (finalizeRes.error) {
           throw finalizeRes.error;
        }
        router.push("/dashboard");
      } else {
        setError(`Login incomplete (${signIn.status}). Please check your setup.`);
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSSO = async () => {
    if (!signIn) return;
    setOauthLoading(true);
    setError("");
    
    try {
      // Initiate Google SSO, replacing the current page with the OAuth provider
      const res = await signIn.sso({ 
        strategy: "oauth_google", 
        redirectUrl: "/dashboard",
        redirectCallbackUrl: "/sso-callback" 
      });
      
      if (res.error) throw res.error;
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || err?.message || "Google SSO failed.");
      setOauthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-foreground/[0.03] rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[35rem] h-[35rem] bg-foreground/[0.02] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-[400px] mx-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          ← Back to portfolio
        </Link>

        {/* Login card */}
        <div className="space-y-8 animate-fade-in-up">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Access your dashboard to manage portfolio content.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground block"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full h-12 bg-background border border-input rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground block"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-12 bg-background border border-input rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading || oauthLoading || !signIn}
              className="w-full h-12 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                "Login with Email"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleSSO}
            disabled={loading || oauthLoading || !signIn}
            className="w-full h-12 bg-background text-foreground border border-input rounded-xl text-sm font-medium hover:bg-foreground/5 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {oauthLoading ? (
              <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground/50">
            Admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
