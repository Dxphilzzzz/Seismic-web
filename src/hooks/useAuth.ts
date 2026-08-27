"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const DEMO_ADMIN_EMAIL = "admin@seismic.local";
const DEMO_ADMIN_PASSWORD = "admin123";
const DEMO_STORAGE_KEY = "seismic-demo-admin";

function createDemoUser(email: string): User {
  const timestamp = Date.now();

  return {
    uid: "demo-admin",
    email,
    emailVerified: true,
    displayName: "Demo Admin",
    isAnonymous: false,
    photoURL: null,
    providerData: [],
    providerId: "demo",
    refreshToken: "demo-refresh-token",
    tenantId: null,
    metadata: {
      creationTime: new Date(timestamp).toISOString(),
      lastSignInTime: new Date(timestamp).toISOString(),
    },
    getIdToken: async () => "demo-token",
    getIdTokenResult: async () => ({ token: "demo-token" }) as never,
    reload: async () => undefined,
    delete: async () => undefined,
    toJSON: () => ({ uid: "demo-admin", email }),
  } as unknown as User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { email?: string };
        if (parsed.email) {
          setUser(createDemoUser(parsed.email));
        }
      } catch {
        window.localStorage.removeItem(DEMO_STORAGE_KEY);
      }
    }

    if (!auth) {
      setIsAuthLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      const savedEmail = window.localStorage.getItem(DEMO_STORAGE_KEY);
      const fallbackEmail = savedEmail ? JSON.parse(savedEmail).email ?? DEMO_ADMIN_EMAIL : null;
      setUser(nextUser ?? (fallbackEmail ? createDemoUser(fallbackEmail) : null));
      setIsAuthLoading(false);
    });
  }, []);

  return {
    user,
    isAuthLoading,
    signIn: async (email: string, password: string) => {
      const trimmedEmail = email.trim().toLowerCase();
      if (trimmedEmail === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
        const demoUser = createDemoUser(trimmedEmail);
        window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ email: trimmedEmail }));
        setUser(demoUser);
        setIsAuthLoading(false);
        return demoUser;
      }

      if (!auth) {
        throw new Error("Firebase auth is not configured. Use the demo admin account in local mode.");
      }

      return signInWithEmailAndPassword(auth, email, password);
    },
    logOut: async () => {
      window.localStorage.removeItem(DEMO_STORAGE_KEY);
      setUser(null);
      if (!auth) return undefined;
      return signOut(auth);
    },
  };
}
