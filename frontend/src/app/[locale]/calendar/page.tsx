"use client";

import { CalendarView } from "@/core/components/calendar/calendar-view";
import { DeadlineList } from "@/core/components/calendar/deadline-list";
import { DeadlineStats } from "@/core/components/calendar/deadline-stats";
import { UpcomingDeadlines } from "@/core/components/calendar/upcoming-deadlines";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select";
import { userService } from "@/core/services/user-service";
import { Calendar, Filter, List, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface Deadline {
	id: string;
	title: string;
	type: string;
	date: string;
	time: string;
	status: string;
	priority: string;
	description: string;
	applicationId: string;
	scholarshipId: string;
	daysLeft: number;
	category: string;
	provider: string;
	amount: string;
}

export default function CalendarPage() {
	const t = useTranslations("deadline");
	const [deadlines, setDeadlines] = useState<Deadline[]>([]);
	const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
	const [filterType, setFilterType] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	useEffect(() => {
		const fetchDeadlines = async () => {
			const user = userService.getUser();
			if (user) {
				try {
					const interestedScholarships =
						await userService.getInterestedScholarships(user.id);
					const formattedDeadlines = interestedScholarships.map(
						(scholarship: any) => {
							const closeDate = new Date(scholarship.close_date);
							const now = new Date();
							const daysLeft = Math.ceil(
								(closeDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
							);
							return {
								id: scholarship.scholarship_id,
								title: scholarship.name,
								type: "application",
								date: closeDate.toLocaleDateString("en-GB"),
								time: "23:59",
								status: daysLeft <= 7 ? "urgent" : "pending",
								priority: daysLeft <= 7 ? "high" : "medium",
								description: `Application deadline for ${scholarship.name}`,
								applicationId: scholarship.scholarship_id,
								scholarshipId: scholarship.scholarship_id,
								daysLeft: daysLeft,
								category: "Application Deadline",
								provider: "N/A",
								amount: "N/A",
							};
						},
					);
					setDeadlines(formattedDeadlines);
				} catch (error) {
					console.error("Failed to fetch interested scholarships:", error);
				}
			}
		};

		fetchDeadlines();
	}, []);

	const filteredDeadlines = deadlines.filter((deadline) => {
		const matchesType = filterType === "all" || deadline.type === filterType;
		const matchesStatus =
			filterStatus === "all" || deadline.status === filterStatus;
		return matchesType && matchesStatus;
	});

	const sortedDeadlines = [...filteredDeadlines].sort((a, b) => {
		const dateA = a.date.split("/");
		const dateB = b.date.split("/");
		const newDateA = new Date(
			parseInt(dateA[2]),
			parseInt(dateA[1]) - 1,
			parseInt(dateA[0]),
		);
		const newDateB = new Date(
			parseInt(dateB[2]),
			parseInt(dateB[1]) - 1,
			parseInt(dateB[0]),
		);
		return newDateA.getTime() - newDateB.getTime();
	});

	const updateDeadlineStatus = (deadlineId: string, newStatus: string) => {
		setDeadlines((prev) =>
			prev.map((deadline) =>
				deadline.id === deadlineId
					? { ...deadline, status: newStatus }
					: deadline,
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
							<h1 className="text-3xl font-bold mb-2">
								{t("deadline_tracker")}
							</h1>
							<p className="text-muted-foreground">
								{t("deadline_tracker_description")}
							</p>
						</div>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							{t("add_custom_deadline")}
						</Button>
					</div>

					{/* Stats Overview */}
					<DeadlineStats deadlines={deadlines} />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar - Upcoming Deadlines */}
					<div className="lg:col-span-1">
						<UpcomingDeadlines deadlines={sortedDeadlines.slice(0, 8)} />
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3 space-y-6">
						{/* Controls */}
						<Card>
							<CardContent className="p-6">
								<div className="flex flex-col lg:flex-row gap-4">
									{/* View Toggle */}
									<div className="flex gap-2">
										<Button
											variant={viewMode === "calendar" ? "default" : "outline"}
											onClick={() => setViewMode("calendar")}
											size="sm"
										>
											<Calendar className="mr-2 h-4 w-4" />
											{t("calendar")}
										</Button>
										<Button
											variant={viewMode === "list" ? "default" : "outline"}
											onClick={() => setViewMode("list")}
											size="sm"
										>
											<List className="mr-2 h-4 w-4" />
											{t("list")}
										</Button>
									</div>

									{/* Filters */}
									<div className="flex gap-2 flex-1">
										<Select value={filterType} onValueChange={setFilterType}>
											<SelectTrigger className="w-40">
												<SelectValue placeholder={t("type")} />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">{t("all_types")}</SelectItem>
												<SelectItem value="application">
													{t("applications")}
												</SelectItem>
												<SelectItem value="task">{t("tasks")}</SelectItem>
												<SelectItem value="interview">
													{t("interviews")}
												</SelectItem>
												<SelectItem value="result">{t("results")}</SelectItem>
											</SelectContent>
										</Select>

										<Select
											value={filterStatus}
											onValueChange={setFilterStatus}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder={t("status")} />
											</SelectTrigger>
											<SelectContent style={{ maxHeight: "unset" }}>
												<SelectItem value="all">{t("all_status")}</SelectItem>
												<SelectItem value="urgent">{t("urgent")}</SelectItem>
												<SelectItem value="upcoming">
													{t("upcoming")}
												</SelectItem>
												<SelectItem value="pending">{t("pending")}</SelectItem>
												<SelectItem value="completed">
													{t("completed")}
												</SelectItem>
											</SelectContent>
										</Select>

										<Button variant="outline" size="sm">
											<Filter className="mr-2 h-4 w-4" />
											{t("more_filters")}
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Main View */}
						{viewMode === "calendar" ? (
							<CalendarView
								deadlines={filteredDeadlines}
								selectedMonth={selectedMonth}
								selectedYear={selectedYear}
								onMonthChange={setSelectedMonth}
								onYearChange={setSelectedYear}
								onStatusChange={updateDeadlineStatus}
							/>
						) : (
							<DeadlineList
								deadlines={sortedDeadlines}
								onStatusChange={updateDeadlineStatus}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
