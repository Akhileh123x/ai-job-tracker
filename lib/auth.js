// lib/auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "./mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: client
  }),
  basePath: "/api/auth", 
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    }
  },
  // Tells Better Auth to trust your domains
  trustedOrigins: [
    "https://ai-job-tracker-six-mu.vercel.app",
    "https://ai-job-tracker-*.vercel.app" 
  ],
  // 🚀 FIX: Disable strict cross-origin check mismatches for deployment environments
  advanced: {
    useSecureCookies: true,
    crossOrigin: true
  }
});