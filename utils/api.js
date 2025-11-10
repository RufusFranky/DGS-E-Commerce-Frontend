// utils/api.js

// ✅ Automatically picks the correct backend URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL_PROD ||
  "http://localhost:4000";

// ✅ Optional: quick debug (you can remove later)
if (typeof window !== "undefined") {
  console.log("API Base URL in browser:", API_BASE_URL);
} else {
  console.log("API Base URL on server:", API_BASE_URL);
}
