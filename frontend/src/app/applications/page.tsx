"use client";

import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select";
import { ApplicationKanban } from "@/modules/applications/components/application-kanban";
import { ApplicationStats } from "@/modules/applications/components/application-stats";
import { ApplicationTable } from "@/modules/applications/components/application-table";
import { mockApplicationSummaries } from "@/modules/applications/data/application-mocks";
import type { ApplicationStatus, ApplicationSummary } from "@/modules/applications/data/application-types";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { useTranslations } from "next-intl";

export default function ApplicationsPage() {
	const t = useTranslations("application");
	const [applications, setApplications] = useState<ApplicationSummary[]>(mockApplicationSummaries);
	const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");
	const [sortBy, setSortBy] = useState("deadline");

	const filteredApplications = applications.filter((app) => {
		const matchesSearch =
			searchQuery === "" ||
			app.scholarshipTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
			app.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
			app.country.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus = statusFilter === "all" || app.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const sortedApplications = [...filteredApplications].sort((a, b) => {
		switch (sortBy) {
			case "deadline":
				return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
			case "progress":
				return b.progress - a.progress;
			case "updated":
				return (
					new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
				);
			default:
				return 0;
		}
	});

	const updateApplicationStatus = (appId: string, newStatus: ApplicationStatus) => {
		setApplications((prev) =>
			prev.map((app) =>
				app.id === appId
					? {
							...app,
							status: newStatus,
							lastUpdated: new Date().toISOString().split("T")[0],
							timeline: [
								...app.timeline,
								{
									date: new Date().toISOString().split("T")[0],
									action: `Status changed to ${newStatus}`,
									type: "info",
								},
							],
						}
					: app,
			),
		);
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-7xl px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
						<div>
							<h1 className="text-3xl font-bold mb-2">{t("my_applications")}</h1>
							<p className="text-muted-foreground">
								{t("track_and_manage")}
							</p>
						</div>
						<Button className="w-fit">
							<Plus className="mr-2 h-4 w-4" />
							{t("add_new_application")}
						</Button>
					</div>

					{/* Stats Overview */}
					<ApplicationStats applications={applications} />
				</div>

				{/* Controls */}
				<Card className="mb-6">
					<CardContent className="p-6">
						<div className="flex flex-col lg:flex-row gap-4">
							{/* Search */}
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder={t("search_applications")}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>

							{/* Filters */}
							<div className="flex gap-2">
								<Select
									value={statusFilter}
									onValueChange={(value) => setStatusFilter(value as "all" | ApplicationStatus)}
								>
									<SelectTrigger className="w-40">
										<SelectValue placeholder={t("status")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">{t("all_status")}</SelectItem>
										<SelectItem value="not-started">{t("not_started")}</SelectItem>
										<SelectItem value="in-progress">{t("in_progress")}</SelectItem>
										<SelectItem value="submitted">{t("submitted")}</SelectItem>
										<SelectItem value="interview">{t("interview")}</SelectItem>
										<SelectItem value="result">{t("result")}</SelectItem>
									</SelectContent>
								</Select>

								<Select value={sortBy} onValueChange={setSortBy}>
									<SelectTrigger className="w-40">
										<SelectValue placeholder={t("sort_by")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="deadline">{t("deadline")}</SelectItem>
										<SelectItem value="progress">{t("progress")}</SelectItem>
										<SelectItem value="updated">{t("last_updated")}</SelectItem>
									</SelectContent>
								</Select>

								<Button
									variant={viewMode === "kanban" ? "default" : "outline"}
									onClick={() => setViewMode("kanban")}
									size="sm"
								>
									{t("kanban")}
								</Button>
								<Button
									variant={viewMode === "table" ? "default" : "outline"}
									onClick={() => setViewMode("table")}
									size="sm"
								>
									{t("table")}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Main Content */}
				{viewMode === "kanban" ? (
					<ApplicationKanban
						applications={sortedApplications}
						onStatusChange={updateApplicationStatus}
					/>
				) : (
					<ApplicationTable
						applications={sortedApplications}
						onStatusChange={updateApplicationStatus}
					/>
				)}
			</div>
		</div>
	);
}
