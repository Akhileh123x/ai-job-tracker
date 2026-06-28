// lib/auth-client.js
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Points natively to your Next.js application root context location URL framework
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { useSession, signIn, signUp, signOut } = authClient;