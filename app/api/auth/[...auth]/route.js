// app/api/auth/[...auth]/route.js
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// BetterAuth uses the 'toNextJsHandler' helper to cleanly extract the GET and POST endpoints
export const { GET, POST } = toNextJsHandler(auth);