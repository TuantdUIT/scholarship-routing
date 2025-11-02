"use client";

import {
	AUTH_COOKIE_KEY,
	AUTH_COOKIE_MAX_AGE,
	AUTH_STORAGE_KEY,
} from "@/core/config/auth";
import type { UserProfile } from "@/core/services/auth-api";
import { apiClient } from "./api-client";

export interface AuthUser {
	id: string;
	name?: string | null;
	email?: string | null;
	avatar?: string | null;
	token?: string;
	profile?: UserProfile | null;
}

const isBrowser = typeof window !== "undefined";

const getCookieValue = (key: string): string | null => {
	if (!isBrowser) {
		return null;
	}
	const match = document.cookie
		.split(";")
		.map((cookie) => cookie.trim())
		.find((cookie) => cookie.startsWith(`${key}=`));

	if (!match) {
		return null;
	}

	return decodeURIComponent(match.split("=")[1] ?? "");
};

const setCookieValue = (key: string, value: string | null) => {
	if (!isBrowser) {
		return;
	}

	if (!value) {
		document.cookie = `${key}=; path=/; max-age=0; sameSite=lax`;
		return;
	}

	document.cookie = `${key}=${value}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; sameSite=lax`;
};

const readUserFromStorage = (): AuthUser | null => {
	if (!isBrowser) {
		return null;
	}

	try {
		const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
		if (!stored) {
			return null;
		}
		return JSON.parse(stored) as AuthUser;
	} catch (error) {
		console.warn("Failed to parse stored auth user", error);
		return null;
	}
};

const persistUser = (user: AuthUser | null) => {
	if (!isBrowser) {
		return;
	}

	if (!user) {
		window.localStorage.removeItem(AUTH_STORAGE_KEY);
		setCookieValue(AUTH_COOKIE_KEY, null);
		return;
	}

	window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
	setCookieValue(AUTH_COOKIE_KEY, encodeURIComponent(user.id));
};

export const userService = {
	getUser(): AuthUser | null {
		return readUserFromStorage();
	},

	saveUser(user: AuthUser) {
		persistUser(user);
	},

	clearUser() {
		persistUser(null);
	},

	isAuthenticated(): boolean {
		if (!isBrowser) {
			return false;
		}

		const cookie = getCookieValue(AUTH_COOKIE_KEY);
		if (cookie) {
			return true;
		}

		return !!readUserFromStorage();
	},

	async addScholarshipToInterest(user_id: string,
		interestData: {
		scholarship_id: string;
		name: string;
		open_date: string;
		close_date: string;
	}): Promise<any> {
		const response = await apiClient.post(`/user/interests/${user_id}/add`, interestData);
		return response.data;
	},

	async removeScholarshipFromInterest(
		scholarshipId: string,
		userId: string,
	): Promise<any> {
		const response = await apiClient.delete(`/user/interests/${userId}/{scholarship_id}`, {
			data: { scholarship_id: scholarshipId, user_id: userId },
		});
		return response.data;
	},

	async getInterestedScholarships(userId: string): Promise<any> {
		const response = await apiClient.get(`/user/interests/${userId}`);
		return response.data;
	},
};
