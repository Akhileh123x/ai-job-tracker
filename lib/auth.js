// lib/auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "./mongodb";

export const auth = betterAuth({
  // FIX: Explicitly map both components so the adapter structures pool sessions safely
  database: mongodbAdapter(db, {
    client: client
  }),
  // Matches your folder paths: app/api/auth/[...auth]/route.js verbatim
  basePath: "/api/auth", 
  emailAndPassword: {
    enabled: true,
  },
  // Optional: Ensures the session is cached seamlessly on client actions
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    }
  }
});