export const AUTH_COOKIE_KEY = "scholar_auth";
export const AUTH_STORAGE_KEY = "scholar.auth.user";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const PROTECTED_ROUTES = [
	"/applications",
	"/calendar",
	"/profile",
	"/scholarships",
];
