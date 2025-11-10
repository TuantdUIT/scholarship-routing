import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../config/api";

/**
 * Creates an Axios instance with the specified base URL and timeout.
 * @param baseUrl - The base URL for the API - defaults to API_BASE_URL.
 * @param timeout - The timeout for the API requests - defaults to API_TIMEOUT.
 * @returns An **public** Axios instance.
 */
const createApiClientFactory = (baseUrl?: string, timeout?: number, withCredentials = false) => {
  const _baseUrl = baseUrl || API_BASE_URL;
  const _timeout = timeout || API_TIMEOUT;

	return axios.create({
		baseURL: _baseUrl,
		timeout: _timeout,
		withCredentials, // This is the key change - no credentials for public endpoints
		headers: {
			"Content-Type": "application/json",
		},
	});
};

// Create a separate API client for public endpoints (without credentials)
export const publicApiClient = createApiClientFactory();

// Add response interceptor for error handling
publicApiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isAxiosError(error) && error.response) {
			const message = error.response.data?.message ?? error.message;
			return Promise.reject(new Error(message));
		}
		return Promise.reject(error);
	},
);

export const protectedApiClient = createApiClientFactory(API_BASE_URL, API_TIMEOUT, true);

export const setAuthToken = (token: string | null) => {
	if (!token) {
		delete protectedApiClient.defaults.headers.common.Authorization;
		return;
	}

	protectedApiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

protectedApiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isAxiosError(error) && error.response) {
			const message = error.response.data?.message ?? error.message;
			return Promise.reject(new Error(message));
		}

		return Promise.reject(error);
	},
);
