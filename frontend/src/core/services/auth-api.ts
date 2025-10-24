import axios from "axios";
import { API_BASE_URL } from "@/core/config/api";

const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

const REGISTER_URL = `${AUTH_BASE_URL}/register`;
const VERIFY_URL = `${AUTH_BASE_URL}/verify`;
const PROFILE_URL = `${AUTH_BASE_URL}/profile`;

export interface RegisterPayload {
	email: string;
	password: string;
	display_name: string;
	name: string;
	gender: string;
	birth_date: string;
	gpa_range_4: number;
	desired_scholarship_type: string[];
	desired_countries: string[];
	desired_funding_level: string[];
	desired_application_mode: string[];
	desired_application_month: number;
	desired_field_of_study: string[];
	notes: string;
	degree: string;
	field_of_study: string;
	language_certificates: string;
	academic_certificates: string;
	academic_awards: string;
	publications: string;
	years_of_experience: number;
	total_working_hours: number;
	tags: string[];
	special_things: string;
}

export interface RegisterResponse {
	uid: string;
	email: string;
	display_name?: string | null;
}

export interface VerifyPayload {
	id_token: string;
}

export type VerifyResponse = Record<string, unknown>;

export interface UserProfile {
	uid: string;
	email: string;
	display_name?: string | null;
	name?: string | null;
	gender?: string | null;
	birth_date?: string | null;
	gpa_range_4?: number | null;
	desired_scholarship_type?: string[] | null;
	desired_countries?: string[] | null;
	desired_funding_level?: string[] | null;
	desired_application_mode?: string[] | null;
	desired_application_month?: number | null;
	desired_field_of_study?: string[] | null;
	notes?: string | null;
	degree?: string | null;
	field_of_study?: string | null;
	language_certificates?: string | null;
	academic_certificates?: string | null;
	academic_awards?: string | null;
	publications?: string | null;
	years_of_experience?: number | null;
	total_working_hours?: number | null;
	tags?: string[] | null;
	special_things?: string | null;
}

export type UserProfileResponse = UserProfile | null;

export interface UpdateProfilePayload {
	name?: string;
	gender?: string;
	birth_date?: string;
	gpa_range_4?: number;
	desired_scholarship_type?: string[];
	desired_countries?: string[];
	desired_funding_level?: string[];
	desired_application_mode?: string[];
	desired_application_month?: number;
	desired_field_of_study?: string[];
	notes?: string;
	degree?: string;
	field_of_study?: string;
	language_certificates?: string;
	academic_certificates?: string;
	academic_awards?: string;
	publications?: string;
	years_of_experience?: number;
	total_working_hours?: number;
	tags?: string[];
	special_things?: string;
}

export const authApi = {
	async register(payload: RegisterPayload) {
		const response = await axios.post<RegisterResponse>(REGISTER_URL, payload);
		return response.data;
	},

	async verify(payload: VerifyPayload) {
		const response = await axios.post<VerifyResponse>(VERIFY_URL, payload);
		return response.data;
	},

	async getProfile(uid: string) {
		const response = await axios.get<UserProfileResponse>(
			`${PROFILE_URL}/${uid}`,
		);
		return response.data;
	},

	async updateProfile(uid: string, payload: UpdateProfilePayload) {
		const response = await axios.put<UserProfile>(
			`${PROFILE_URL}/${uid}`,
			payload,
		);
		return response.data;
	},
};
