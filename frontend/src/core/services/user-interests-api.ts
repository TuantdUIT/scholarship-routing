import { apiClient } from "./api-client";
import { ScholarshipApi } from "./scholarship-api";
import { API_BASE_URL } from "@/core/config/api";

export interface ScholarInterest {
	close_date: string;
	name: string;
	open_date: string;
	scholarship_id: string;
}

export interface UserInterestsResponse {
	scholar_interests: ScholarInterest[];
}

export class UserInterestsApi {
	/**
	 * Get user interests/deadlines by user ID
	 */
	static async getUserInterests(uid: string): Promise<UserInterestsResponse> {
		const endpoint = `/user/interests/${uid}`;
		console.log("Making API call to:", `${API_BASE_URL}${endpoint}`);
		try {
			const response = await apiClient.get(endpoint);
			console.log("Raw API response:", response);
			return response.data;
		} catch (error) {
			console.error("API call failed:", error);
			throw error;
		}
	}

	/**
	 * Calculate days left until deadline
	 */
	static calculateDaysLeft(closeDate: string): number {
		const deadline = new Date(closeDate);
		const today = new Date();
		const diffTime = deadline.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	/**
	 * Determine priority based on days left
	 */
	static determinePriority(daysLeft: number): string {
		if (daysLeft <= 0) return "overdue";
		if (daysLeft <= 7) return "critical";
		if (daysLeft <= 30) return "high";
		return "medium";
	}

	/**
	 * Determine status based on days left
	 */
	static determineStatus(daysLeft: number): string {
		if (daysLeft <= 0) return "overdue";
		if (daysLeft <= 7) return "urgent";
		if (daysLeft <= 30) return "upcoming";
		return "pending";
	}

	/**
	 * Transform API response to match the deadline format
	 * Fetches full scholarship details for each interest
	 */
	static async transformToDeadlineFormat(
		interests: ScholarInterest[],
	): Promise<any[]> {
		console.log("Transforming interests:", interests);
		
		const deadlines = await Promise.all(
			interests.map(async (interest) => {
				console.log("Processing interest:", interest);
				
				const daysLeft = this.calculateDaysLeft(interest.close_date);
				const priority = this.determinePriority(daysLeft);
				const status = this.determineStatus(daysLeft);

				console.log(`Days left: ${daysLeft}, Priority: ${priority}, Status: ${status}`);

				// Try to fetch full scholarship details
				let scholarshipDetails = null;
				try {
					console.log(`Fetching scholarship details for ID: ${interest.scholarship_id}`);
					const scholarship = await ScholarshipApi.getScholarshipById(
						interest.scholarship_id,
					);
					scholarshipDetails = scholarship.source;
					console.log("Scholarship details:", scholarshipDetails);
				} catch (error) {
					console.error(
						`Failed to fetch scholarship ${interest.scholarship_id}:`,
						error,
					);
				}

				const deadline = {
					id: interest.scholarship_id,
					title: interest.name,
					type: "application",
					date: new Date(interest.close_date).toLocaleDateString("en-GB"),
					time: "23:59",
					status: status,
					priority: priority,
					description: scholarshipDetails?.Scholarship_Info || "",
					applicationId: interest.scholarship_id,
					scholarshipId: interest.scholarship_id,
					daysLeft: daysLeft,
					category: "Application Deadline",
					provider:
						scholarshipDetails?.Scholarship_Type ||
						scholarshipDetails?.Country ||
						"Unknown",
					amount: scholarshipDetails?.Funding_Level || "",
				};

				console.log("Created deadline:", deadline);
				return deadline;
			}),
		);

		console.log("All transformed deadlines:", deadlines);
		return deadlines;
	}
}
