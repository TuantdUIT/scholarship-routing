import { publicApiClient } from "@/core/lib/api-client";
import type {
    ScholarshipFilterParams,
    ScholarshipItem,
    ScholarshipSearchResponse
} from "../types";

export class ScholarshipApiHelpers {
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
    collection = "scholarships_en",
  ): Promise<ScholarshipSearchResponse> {
    // Use filter with empty filters to get all scholarships, sorted by newest
    return this.filterScholarships({
      collection: collection,
      size,
      offset,
      filters: [],
    });
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
