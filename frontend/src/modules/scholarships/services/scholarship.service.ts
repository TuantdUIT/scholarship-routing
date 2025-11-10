import { publicApiClient } from "@/core/lib/api-client";
import type { ScholarshipSearchParams, ScholarshipSearchResponse } from "../types";
import { ScholarshipApiHelpers } from "./scholarship-api-helpers";
import type { IScholarshipSearchService } from "./scholarship.interface";

export class ScholarshipSearchService implements IScholarshipSearchService {
  /**
   * Search scholarships using full-text search
   */
  async getScholarships(
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
}

export const scholarshipSearchService = new ScholarshipSearchService();

export const getScholarship = async (id: string) => {
  try {
    const scholarshipData = await ScholarshipApiHelpers.getScholarshipById(id);
    // The detail page needs more fields than what transformToUIFormat provides.
    // For now, we can just return the raw source data and the page can adapt.
    // This avoids creating a complex transformer without knowing the exact API response structure for all fields.
    return scholarshipData.source;
  } catch (error) {
    console.error("Failed to fetch scholarship:", error);
    return null;
  }
};
