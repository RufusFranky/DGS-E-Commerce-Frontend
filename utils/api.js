// utils/api.js

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  process.env.NEXT_PUBLIC_API_BASE_URL_PROD || 
  "http://localhost:4000";

// Debug
if (typeof window !== "undefined") {
  console.log("API Base URL (browser):", API_BASE_URL);
} else {
  console.log("API Base URL (server):", API_BASE_URL);
}
