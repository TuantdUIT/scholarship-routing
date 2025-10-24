export type ApplicationStatus =
	| "not-started"
	| "in-progress"
	| "submitted"
	| "interview"
	| "result";

export interface ApplicationDocumentsSummary {
	required: string[];
	uploaded: string[];
	pending: string[];
}

export type ApplicationTimelineEventType =
	| "info"
	| "success"
	| "warning"
	| "error";

export interface ApplicationTimelineEvent {
	date: string;
	action: string;
	type: ApplicationTimelineEventType;
	description?: string;
}

export type ApplicationReminderType = "deadline" | "task" | string;

export interface ApplicationReminder {
	id?: string;
	date: string;
	message: string;
	type?: ApplicationReminderType;
	isActive?: boolean;
}

export interface ApplicationBase {
	id: string;
	scholarshipId: string;
	scholarshipTitle: string;
	provider: string;
	country: string;
	amount: string;
	deadline: string;
	status: ApplicationStatus;
	progress: number;
	lastUpdated: string;
	timeline: ApplicationTimelineEvent[];
	reminders: ApplicationReminder[];
}

export interface ApplicationSummary extends ApplicationBase {
	documents: ApplicationDocumentsSummary;
}

export type ApplicationDocumentStatus = "uploaded" | "pending" | "required";

export interface ApplicationDocumentRequirement {
	name: string;
	status: ApplicationDocumentStatus;
	uploadDate: string | null;
	fileSize: string | null;
	fileName: string | null;
}

export interface ApplicationDetail extends ApplicationBase {
	documents: {
		required: ApplicationDocumentRequirement[];
	};
	notes?: string;
	applicationUrl?: string;
}
