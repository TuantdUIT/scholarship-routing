const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL env var is required");
}

export const API_BASE_URL = apiBaseUrl;

export const API_TIMEOUT = 15000;

