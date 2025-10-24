"use client";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	Clock,
	Edit,
	ExternalLink,
	MoreHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface DeadlineListProps {
	deadlines: any[];
	onStatusChange: (deadlineId: string, newStatus: string) => void;
}

export function DeadlineList({ deadlines, onStatusChange }: DeadlineListProps) {
	const t = useTranslations("deadline");

	const getDeadlineIcon = (type: string) => {
		switch (type) {
			case "application":
				return <Calendar className="h-5 w-5 text-blue-600" />;
			case "interview":
				return <Clock className="h-5 w-5 text-purple-600" />;
			case "task":
				return <CheckCircle className="h-5 w-5 text-green-600" />;
			case "result":
				return <Clock className="h-5 w-5 text-orange-600" />;
			default:
				return <Calendar className="h-5 w-5 text-muted-foreground" />;
		}
	};

	const getPriorityBadge = (priority: string) => {
		switch (priority) {
			case "critical":
				return (
					<Badge className="bg-red-100 text-red-800 border-0">
						{t("critical_priority")}
					</Badge>
				);
			case "high":
				return (
					<Badge className="bg-orange-100 text-orange-800 border-0">
						{t("high_priority")}
					</Badge>
				);
			case "medium":
				return (
					<Badge className="bg-blue-100 text-blue-800 border-0">
						{t("medium_priority")}
					</Badge>
				);
			case "low":
				return (
					<Badge className="bg-green-100 text-green-800 border-0">
						{t("low_priority")}
					</Badge>
				);
			default:
				return <Badge variant="outline">{priority}</Badge>;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "urgent":
				return <Badge variant="destructive">{t("urgent")}</Badge>;
			case "upcoming":
				return (
					<Badge className="bg-orange-100 text-orange-800 border-0">
						{t("upcoming")}
					</Badge>
				);
			case "pending":
				return <Badge variant="secondary">{t("pending")}</Badge>;
			case "completed":
				return (
					<Badge className="bg-green-100 text-green-800 border-0">
						{t("completed")}
					</Badge>
				);
			case "waiting":
				return (
					<Badge className="bg-purple-100 text-purple-800 border-0">
						{t("waiting")}
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const getUrgencyProgress = (daysLeft: number) => {
		if (daysLeft <= 0) return 100;
		if (daysLeft <= 7) return 90;
		if (daysLeft <= 14) return 70;
		if (daysLeft <= 30) return 50;
		return 20;
	};

	const getUrgencyColor = (daysLeft: number) => {
		if (daysLeft <= 7) return "bg-red-500";
		if (daysLeft <= 14) return "bg-orange-500";
		if (daysLeft <= 30) return "bg-yellow-500";
		return "bg-green-500";
	};

	return (
		<div className="space-y-4">
			{deadlines.length === 0 ? (
				<Card>
					<CardContent className="text-center py-12">
						<Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							{t("no_deadlines_found")}
						</h3>
						<p className="text-muted-foreground">
							{t("no_deadlines_found_description")}
						</p>
					</CardContent>
				</Card>
			) : (
				deadlines.map((deadline) => (
					<Card
						key={deadline.id}
						className={`hover:shadow-md transition-shadow ${
							deadline.daysLeft <= 7
								? "border-red-200"
								: deadline.daysLeft <= 14
									? "border-orange-200"
									: ""
						}`}
					>
						<CardContent className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-4 flex-1">
									{/* Icon */}
									<div className="flex-shrink-0 mt-1">
										{getDeadlineIcon(deadline.type)}
									</div>

									{/* Main Content */}
									<div className="flex-1 space-y-3">
										{/* Header */}
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-semibold text-lg">
													{deadline.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													{deadline.provider}
												</p>
											</div>
											<div className="flex items-center gap-2">
												{getPriorityBadge(deadline.priority)}
												{getStatusBadge(deadline.status)}
											</div>
										</div>

										{/* Description */}
										<p className="text-sm text-muted-foreground">
											{deadline.description}
										</p>

										{/* Date and Time Info */}
										<div className="flex flex-wrap items-center gap-4 text-sm">
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												<span
													className={`${deadline.daysLeft <= 7 ? "text-red-600 font-medium" : ""}`}
												>
													{new Date(deadline.date).toLocaleDateString()}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-muted-foreground" />
												<span>{deadline.time}</span>
											</div>
											<div className="flex items-center gap-2">
												<span
													className={`font-medium ${
														deadline.daysLeft <= 0
															? "text-red-600"
															: deadline.daysLeft <= 7
																? "text-orange-600"
																: "text-muted-foreground"
													}`}
												>
													{deadline.daysLeft <= 0
														? t("overdue")
														: t("days_left", {
																daysLeft: deadline.daysLeft,
															})}
												</span>
											</div>
											{deadline.amount && (
												<div className="text-muted-foreground">
													{deadline.amount}
												</div>
											)}
										</div>

										{/* Urgency Progress */}
										<div className="space-y-1">
											<div className="flex justify-between text-xs">
												<span>{t("urgency_level")}</span>
												<span
													className={`font-medium ${
														deadline.daysLeft <= 7
															? "text-red-600"
															: deadline.daysLeft <= 14
																? "text-orange-600"
																: "text-muted-foreground"
													}`}
												>
													{deadline.daysLeft <= 0
														? t("overdue")
														: deadline.daysLeft <= 7
															? t("critical_priority")
															: deadline.daysLeft <= 14
																? t("high_priority")
																: deadline.daysLeft <= 30
																	? t("medium_priority")
																	: t("low_priority")}
												</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2">
												<div
													className={`h-2 rounded-full transition-all ${getUrgencyColor(deadline.daysLeft)}`}
													style={{
														width: `${getUrgencyProgress(deadline.daysLeft)}%`,
													}}
												/>
											</div>
										</div>

										{/* Actions */}
										<div className="flex items-center justify-between pt-2">
											<div className="flex gap-2">
												<Button variant="outline" size="sm" asChild>
													<Link
														href={`/applications/${deadline.applicationId}`}
													>
														<Edit className="mr-2 h-4 w-4" />
														{t("view_application")}
													</Link>
												</Button>
												<Button variant="outline" size="sm" asChild>
													<Link
														href={`/scholarships/${deadline.scholarshipId}`}
													>
														<ExternalLink className="mr-2 h-4 w-4" />
														{t("view_scholarship")}
													</Link>
												</Button>
											</div>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() =>
															onStatusChange(deadline.id, "completed")
														}
													>
														{t("mark_as_completed")}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															onStatusChange(deadline.id, "pending")
														}
													>
														{t("mark_as_pending")}
													</DropdownMenuItem>
													<DropdownMenuItem>
														{t("set_reminder")}
													</DropdownMenuItem>
													<DropdownMenuItem>
														{t("edit_deadline")}
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))
			)}
		</div>
	);
}
