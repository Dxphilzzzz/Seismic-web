"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";

export const TEST_ADMIN_EMAIL = "admin@seismic.local";
export const TEST_ADMIN_PASSWORD = "admin123";

const TEST_SESSION_KEY = "seismic-test-admin";

function createTestUser(email: string): User {
  return {
    uid: "test-admin",
    email,
    emailVerified: true,
    displayName: "Test Admin",
    isAnonymous: false,
    photoURL: null,
    providerData: [],
    providerId: "test",
    tenantId: null,
    metadata: {},
    getIdToken: async () => "test-token",
    getIdTokenResult: async () => ({ token: "test-token" }) as never,
    reload: async () => undefined,
    delete: async () => undefined,
    toJSON: () => ({ uid: "test-admin", email }),
  } as unknown as User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const savedEmail = window.localStorage.getItem(TEST_SESSION_KEY);
    setUser(savedEmail ? createTestUser(savedEmail) : null);
    setIsAuthLoading(false);
  }, []);

  return {
    user,
    isAuthLoading,
    signIn: async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (
        normalizedEmail !== TEST_ADMIN_EMAIL ||
        password !== TEST_ADMIN_PASSWORD
      ) {
        throw new Error("Invalid test admin credentials.");
      }

      window.localStorage.setItem(TEST_SESSION_KEY, normalizedEmail);
      const testUser = createTestUser(normalizedEmail);
      setUser(testUser);
      setIsAuthLoading(false);
      return testUser;
    },
    logOut: async () => {
      window.localStorage.removeItem(TEST_SESSION_KEY);
      setUser(null);
    },
  };
}
