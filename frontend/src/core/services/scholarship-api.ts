import { apiClient } from "./api-client";
import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "@/core/config/api";

// Create a separate API client for public endpoints (without credentials)
const publicApiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: API_TIMEOUT,
	withCredentials: false, // This is the key change - no credentials for public endpoints
	headers: {
		"Content-Type": "application/json",
	},
});

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

export interface FilterItem {
	field: string;
	values: (string | number | boolean)[];
	operator: "AND" | "OR";
}

export interface ScholarshipSearchParams {
	q: string;
	size?: number;
	offset?: number;
	collection: string;
}

export interface ScholarshipFilterParams {
	collection: string;
	size?: number;
	offset?: number;
	inter_field_operator?: "AND" | "OR";
	filters: FilterItem[];
}

export interface ScholarshipItem {
	id: string;
	score: number;
	source: {
		Scholarship_Name: string;
		Country: string;
		Scholarship_Info: string;
		Funding_Level: string;
		Funding_Details: string;
		Required_Degree: string;
		Min_Gpa: string;
		Language_Certificate: string;
		End_Date: string;
		Start_Date: string;
		Url: string;
		Eligible_Fields: string;
		Application_Documents: string;
		Other_Requirements: string;
		Career_Plan: string;
		Scholarship_Type: string;
		Age: string;
		Gender: string;
		Experience_Years: number;
		For_Vietnamese: boolean;
		Field_Restriction: string;
		Bachelor_Field_Relevance: string;
		collection: string;
		[key: string]: any;
	};
}

export interface ScholarshipSearchResponse {
	total: number;
	items: ScholarshipItem[];
}

// UI-compatible scholarship interface
export interface UIScholarship {
	id: string;
	title: string;
	provider: string;
	country: string;
	degreeLevel: string;
	amount: string;
	deadline: string;
	matchScore: number;
	hardConditionsPassed: boolean;
	failedConditions: string[];
	description: string;
	tags: string[];
	link: string;
}

export class ScholarshipApi {
	/**
	 * Search scholarships using full-text search
	 */
	static async searchScholarships(
		params: ScholarshipSearchParams,
	): Promise<ScholarshipSearchResponse> {
		const response = await publicApiClient.get("/es/search", {
			params: {
				q: params.q,
				size: params.size || 10,
				offset: params.offset || 0,
				collection: params.collection,
			},
		});
		return response.data;
	}

	/**
	 * Filter scholarships using advanced filters
	 */
	static async filterScholarships(
		params: ScholarshipFilterParams,
	): Promise<ScholarshipSearchResponse> {
		const response = await publicApiClient.post("/es/filter", params.filters, {
			params: {
				collection: params.collection,
				size: params.size || 10,
				offset: params.offset || 0,
				inter_field_operator: params.inter_field_operator || "AND",
			},
		});
		return response.data;
	}

	/**
	 * Get latest scholarships (default view)
	 */
	static async getLatestScholarships(
		size = 10,
		offset = 0,
	): Promise<ScholarshipSearchResponse> {
		// Use filter with empty filters to get all scholarships, sorted by newest
		return this.filterScholarships({
			collection: "scholarships_en",
			size,
			offset,
			filters: [],
		});
	}

	/**
	 * Transform API scholarship data to UI format
	 */
	static transformToUIFormat(apiScholarship: ScholarshipItem): UIScholarship {
		const source = apiScholarship.source;

		// Calculate match score based on available data (simplified)
		const matchScore = Math.round(apiScholarship.score * 100);

		// Determine if hard conditions are passed (simplified logic)
		const hardConditionsPassed = source.For_Vietnamese === true;

		// Generate tags based on scholarship data
		const tags: string[] = [];
		if (source.Funding_Level?.includes("Toàn phần")) tags.push("Toàn phần");
		if (source.Scholarship_Type) tags.push(source.Scholarship_Type);
		if (source.Field_Restriction === "Có") tags.push("Hạn chế ngành");

		// Format deadline
		let deadline = "";
		if (source.End_Date) {
			try {
				deadline = new Date(source.End_Date).toISOString().split("T")[0];
			} catch {
				deadline = source.End_Date;
			}
		}

		return {
			id: apiScholarship.id,
			title: source.Scholarship_Name || "Không có tên",
			provider: source.Scholarship_Type || "Không rõ",
			country: source.Country || "Không rõ",
			degreeLevel: source.Required_Degree || "Không rõ",
			amount: source.Funding_Details || source.Funding_Level || "Không rõ",
			deadline: deadline,
			matchScore: matchScore,
			hardConditionsPassed: hardConditionsPassed,
			failedConditions: hardConditionsPassed ? [] : ["Cần kiểm tra điều kiện"],
			description: source.Scholarship_Info || "Không có mô tả",
			tags: tags,
			link: source.Url || "#",
		};
	}

	/**
	 * Transform API response to UI format
	 */
	static transformResponseToUI(response: ScholarshipSearchResponse): {
		total: number;
		scholarships: UIScholarship[];
	} {
		return {
			total: response.total,
			scholarships: response.items.map((item) =>
				this.transformToUIFormat(item),
			),
		};
	}

	/**
	 * Get a single scholarship by its ID from the API using the filter endpoint
	 */
	static async getScholarshipById(
		id: string,
		collection = "scholarships_en",
	): Promise<ScholarshipItem> {
		const filterParams: ScholarshipFilterParams = {
			collection: collection,
			size: 1,
			offset: 0,
			filters: [
				{
					field: "id", // Assuming the document ID field is named 'id'
					values: [id],
					operator: "AND",
				},
			],
		};

		const response = await this.filterScholarships(filterParams);

		if (response.items.length === 0) {
			throw new Error(`Scholarship with id ${id} not found`);
		}

		return response.items[0];
	}
}

export const getScholarship = async (id: string) => {
	try {
		const scholarshipData = await ScholarshipApi.getScholarshipById(id);
		// The detail page needs more fields than what transformToUIFormat provides.
		// For now, we can just return the raw source data and the page can adapt.
		// This avoids creating a complex transformer without knowing the exact API response structure for all fields.
		return scholarshipData.source;
	} catch (error) {
		console.error("Failed to fetch scholarship:", error);
		return null;
	}
};
