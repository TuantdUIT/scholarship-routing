import axios from "axios";

const AUTH_BASE_URL = "http://159.223.60.221:8000/api/v1/auth";

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

export type UserProfile = Record<string, unknown> | null;

export interface UpdateProfilePayload {
  [key: string]: unknown;
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
    const response = await axios.get<UserProfile>(`${PROFILE_URL}/${uid}`);
    return response.data;
  },

  async updateProfile(uid: string, payload: UpdateProfilePayload) {
    const response = await axios.put<UserProfile>(`${PROFILE_URL}/${uid}`, payload);
    return response.data;
  },
};
