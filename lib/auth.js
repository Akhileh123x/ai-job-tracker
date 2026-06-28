// lib/auth.js

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "./mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  basePath: "/api/auth",

  emailAndPassword: {
    enabled: true,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://ai-job-tracker-six-mu.vercel.app",
  ],
});