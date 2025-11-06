const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Check current environment
    if (window.location.hostname === "localhost") {
      return process.env.NEXT_PUBLIC_API_URL;
    } else {
      return process.env.NEXT_PUBLIC_API_URL_PROD;
    }
  }
  // For SSR / build time
  return process.env.NEXT_PUBLIC_API_URL_PROD;
};

export const API_BASE_URL = getBaseUrl();
