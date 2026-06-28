// lib/auth-client.js

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Always use the current domain (localhost in development,
  // current Vercel deployment in production)
  baseURL: "/",
});

export const { useSession, signIn, signUp, signOut } = authClient;