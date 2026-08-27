"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, Gauge, Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/dashboard/LoadingScreen";

const stats = [
  { label: "Live events", value: "128" },
  { label: "Avg magnitude", value: "4.82" },
  { label: "Sensor health", value: "99.2%" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && user) router.replace("/admin");
  }, [isAuthLoading, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch {
      setError("Invalid admin credentials. Check the email and password.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isAuthLoading || user) return <LoadingScreen />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1120] px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 shadow-[0_30px_80px_rgba(15,23,42,0.75)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),transparent_35%),linear-gradient(135deg,#111827,#0b1120)] p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-200 transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Public dashboard
            </Link>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-blue">
              <Gauge className="h-3.5 w-3.5" />
              Operations overview
            </div>

            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight text-white">
              Monitor seismic activity with confidence.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Review live telemetry, investigate alert events, and manage critical sensor conditions from a single command center.
            </p>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                <p className="mt-3 font-mono text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-950/80 p-6 sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-blue/20 bg-accent-blue/10">
                <Activity className="h-5 w-5 text-accent-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-blue/80">
                  Admin Access
                </p>
                <h2 className="text-xl font-bold text-white">Seismic Dashboard Login</h2>
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Demo account: admin@seismic.local / admin123
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-3 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-accent-blue/50"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-3 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-accent-blue/50"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-sm text-accent-red">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-xl border border-accent-blue/30 bg-accent-blue px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
