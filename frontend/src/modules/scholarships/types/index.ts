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
export interface ScholarshipDto {
	id: string;
	title: string;
	provider: string;
	country: string;
	degreeLevel: string;
	amount: string;
	deadline: string;
	startDate: string;
	matchScore: number;
	hardConditionsPassed: boolean;
	failedConditions: string[];
	description: string;
	tags: string[];
	link: string;
	isInterested: boolean;
}
