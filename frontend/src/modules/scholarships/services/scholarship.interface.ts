import type { ScholarshipSearchParams, ScholarshipSearchResponse } from "../types";

export interface IScholarshipSearchService {
  /**
   * Search scholarships using full-text search
   */
  getScholarships(
    params: ScholarshipSearchParams,
  ): Promise<ScholarshipSearchResponse>;
}
