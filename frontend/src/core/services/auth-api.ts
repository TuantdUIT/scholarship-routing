import axios from "axios";

const REGISTER_URL = "http://159.223.60.221:8000/api/v1/auth/register";

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
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export const authApi = {
  async register(payload: RegisterPayload) {
    const response = await axios.post<RegisterResponse>(REGISTER_URL, payload);
    return response.data;
  },
};
