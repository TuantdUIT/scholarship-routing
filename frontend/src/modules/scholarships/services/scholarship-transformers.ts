import { formatDate } from "@/core/lib/date";
import type { ScholarshipDto, ScholarshipItem, ScholarshipSearchResponse } from "../types";

export class ScholarshipTransformers {
  /**
   * Transform API scholarship data to UI format
   */
  static transformToUIFormat(apiScholarship: ScholarshipItem): ScholarshipDto {
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
    let End_Date = "";
    if (source.End_Date) {
      try {
        End_Date = formatDate(source.End_Date);
      } catch {
        End_Date = source.End_Date;
      }
    }

    let startDate = "";
    if (source.Start_Date) {
      try {
        startDate = formatDate(source.Start_Date);
      } catch {
        startDate = source.Start_Date;
      }
    }

    return {
      id: apiScholarship.id,
      title: source.Scholarship_Name || "Không có tên",
      provider: source.Scholarship_Type || "Không rõ",
      country: source.Country || "Không rõ",
      degreeLevel: source.Required_Degree || "Không rõ",
      amount: source.Funding_Details || source.Funding_Level || "Không rõ",
      deadline: End_Date,
      startDate: startDate,
      matchScore: matchScore,
      hardConditionsPassed: hardConditionsPassed,
      failedConditions: hardConditionsPassed ? [] : ["Cần kiểm tra điều kiện"],
      description: source.Scholarship_Info || "Không có mô tả",
      tags: tags,
      link: source.Url || "#",
      isInterested: source.isInterested || false, // Default to false if not provided
    };
  }

  /**
   * Transform API response to UI format
   */
  static transformResponseToUI(response: ScholarshipSearchResponse): {
    total: number;
    scholarships: ScholarshipDto[];
  } {
    return {
      total: response.total,
      scholarships: response.items.map((item) =>
        this.transformToUIFormat(item),
      ),
    };
  }
}
