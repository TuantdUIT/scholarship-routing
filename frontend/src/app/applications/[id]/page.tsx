"use client";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import { Progress } from "@/core/components/ui/progress";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/core/components/ui/tabs";
import { Textarea } from "@/core/components/ui/textarea";
import { ApplicationDocuments } from "@/modules/applications/components/application-documents";
import { ApplicationReminders } from "@/modules/applications/components/application-reminders";
import { ApplicationTimeline } from "@/modules/applications/components/application-timeline";
import { mockApplicationDetailMap } from "@/modules/applications/data/application-mocks";
import type { ApplicationDetail, ApplicationStatus } from "@/modules/applications/data/application-types";
import {
	ArrowLeft,
	Bell,
	Calendar,
	CheckCircle,
	Download,
	Edit,
	ExternalLink,
	FileText,
	History,
	MessageSquare,
	Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ApplicationDetailPage() {
	const t = useTranslations("application");
	const params = useParams();
	const applicationId = params.id as string;
	const application = mockApplicationDetailMap[applicationId] as ApplicationDetail | undefined;

	const [notes, setNotes] = useState(application?.notes || "");
	const [activeTab, setActiveTab] = useState("overview");

	if (!application) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Card className="max-w-md">
					<CardContent className="text-center py-8">
						<h2 className="text-xl font-semibold mb-2">
							{t("application_not_found")}
						</h2>
						<p className="text-muted-foreground mb-4">
							{t("application_not_found_description")}
						</p>
						<Button asChild>
							<Link href="/applications">{t("back_to_applications")}</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getDaysUntilDeadline = (deadline: string) => {
		const deadlineDate = new Date(deadline);
		const today = new Date();
		const diffTime = deadlineDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const daysLeft = getDaysUntilDeadline(application.deadline);
	const isUrgent = daysLeft <= 30 && daysLeft > 0;
	const isExpired = daysLeft < 0;

	const getStatusBadge = (status: ApplicationStatus) => {
		const statusConfig = {
			"not-started": { label: t("not_started"), variant: "outline" as const },
			"in-progress": { label: t("in_progress"), variant: "secondary" as const },
			submitted: { label: t("submitted"), variant: "default" as const },
			interview: { label: t("interview"), variant: "default" as const },
			result: { label: t("result"), variant: "default" as const },
		};

		const config = statusConfig[status as keyof typeof statusConfig] || {
			label: status,
			variant: "outline" as const,
		};
		return <Badge variant={config.variant}>{config.label}</Badge>;
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-6xl px-4 py-8">
				{/* Back Navigation */}
				<div className="mb-6">
					<Button variant="ghost" asChild className="mb-4">
						<Link href="/applications" className="flex items-center">
							<ArrowLeft className="mr-2 h-4 w-4" />
							{t("back_to_applications")}
						</Link>
					</Button>
				</div>

				{/* Header */}
				<Card className="mb-8">
					<CardHeader>
						<div className="flex flex-col lg:flex-row justify-between items-start gap-6">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-3">
									<CardTitle className="text-2xl lg:text-3xl">
										{application.scholarshipTitle}
									</CardTitle>
									{getStatusBadge(application.status)}
									{isUrgent && !isExpired && (
										<Badge variant="destructive">{t("urgent")}</Badge>
									)}
									{isExpired && (
										<Badge variant="outline" className="text-muted-foreground">
											{t("expired")}
										</Badge>
									)}
								</div>

								<div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
									<span className="font-medium text-foreground">
										{application.provider}
									</span>
									<span>{application.country}</span>
									<span>{application.amount}</span>
								</div>
							</div>

							{/* Progress & Actions */}
							<div className="flex flex-col items-center gap-4">
								<div className="text-center">
									<div className="text-3xl font-bold text-primary">
										{application.progress}%
									</div>
									<div className="text-sm text-muted-foreground">{t("complete")}</div>
									<Progress
										value={application.progress}
										className="w-20 h-2 mt-1"
									/>
								</div>

								<div className="flex gap-2">
									<Button variant="outline" asChild>
										<Link href={`/scholarships/${application.scholarshipId}`}>
											<ExternalLink className="mr-2 h-4 w-4" />
											{t("view_scholarship")}
										</Link>
									</Button>
									<Button>
										<Edit className="mr-2 h-4 w-4" />
										{t("edit_application")}
									</Button>
								</div>
							</div>
						</div>
					</CardHeader>

					<CardContent>
						{/* Key Information */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Calendar className="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<div className="font-medium">{t("application_deadline")}</div>
									<div
										className={`text-sm ${isUrgent && !isExpired ? "text-orange-600" : "text-muted-foreground"}`}
									>
										{new Date(application.deadline).toLocaleDateString()}
										{!isExpired && (
											<span className="ml-1">({t("days_left", { daysLeft })})</span>
										)}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-lg">
									<FileText className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<div className="font-medium">{t("documents")}</div>
									<div className="text-sm text-muted-foreground">
										{t("uploaded_docs", {
											uploaded: application.documents.required.filter(
												(doc) => doc.status === "uploaded",
											).length,
											total: application.documents.required.length,
										})}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="p-2 bg-orange-100 rounded-lg">
									<Bell className="h-5 w-5 text-orange-600" />
								</div>
								<div>
									<div className="font-medium">{t("active_reminders")}</div>
									<div className="text-sm text-muted-foreground">
										{t("pending_reminders", {
											count: application.reminders.filter((r) => r.isActive)
												.length,
										})}
									</div>
								</div>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="flex flex-col sm:flex-row gap-3">
							<Button size="lg" className="flex-1" disabled={isExpired}>
								{isExpired
									? t("application_closed")
									: t("continue_application")}
							</Button>
							<Button variant="outline" size="lg">
								<Upload className="mr-2 h-4 w-4" />
								{t("upload_documents")}
							</Button>
							<Button variant="outline" size="lg">
								<Download className="mr-2 h-4 w-4" />
								{t("download_progress")}
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Main Content Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
						<TabsTrigger value="overview">{t("overview")}</TabsTrigger>
						<TabsTrigger value="documents">{t("documents")}</TabsTrigger>
						<TabsTrigger value="timeline">{t("timeline")}</TabsTrigger>
						<TabsTrigger value="reminders">{t("reminders")}</TabsTrigger>
						<TabsTrigger value="notes">{t("notes")}</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Progress Overview */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<CheckCircle className="h-5 w-5" />
										{t("application_progress")}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>{t("overall_completion")}</span>
											<span className="font-medium">
												{application.progress}%
											</span>
										</div>
										<Progress value={application.progress} className="h-2" />
									</div>

									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span>{t("documents_uploaded")}</span>
											<span>
												{
													application.documents.required.filter(
														(doc) => doc.status === "uploaded",
													).length
												}
												/{application.documents.required.length}
											</span>
										</div>
										<div className="flex justify-between">
											<span>{t("status")}</span>
											<span>{getStatusBadge(application.status)}</span>
										</div>
										<div className="flex justify-between">
											<span>{t("last_updated_at")}</span>
											<span>
												{new Date(application.lastUpdated).toLocaleDateString()}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Recent Activity */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<History className="h-5 w-5" />
										{t("recent_activity")}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{application.timeline
											.slice(-3)
											.reverse()
											.map((event, index) => (
												<div key={index} className="flex items-start gap-3">
													<div
														className={`p-1 rounded-full ${
															event.type === "success"
																? "bg-green-100"
																: event.type === "warning"
																	? "bg-orange-100"
																	: "bg-blue-100"
														}`}
													>
														<div
															className={`w-2 h-2 rounded-full ${
																event.type === "success"
																	? "bg-green-600"
																	: event.type === "warning"
																		? "bg-orange-600"
																		: "bg-blue-600"
															}`}
														/>
													</div>
													<div className="flex-1">
														<div className="text-sm font-medium">
															{event.action}
														</div>
														<div className="text-xs text-muted-foreground">
															{event.description}
														</div>
														<div className="text-xs text-muted-foreground">
															{new Date(event.date).toLocaleDateString()}
														</div>
													</div>
												</div>
											))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="documents">
						<ApplicationDocuments application={application} />
					</TabsContent>

					<TabsContent value="timeline">
						<ApplicationTimeline application={application} />
					</TabsContent>

					<TabsContent value="reminders">
						<ApplicationReminders application={application} />
					</TabsContent>

					<TabsContent value="notes">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MessageSquare className="h-5 w-5" />
									{t("application_notes")}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<Textarea
										placeholder={t("add_notes_placeholder")}
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										className="min-h-32"
									/>
									<Button>{t("save_notes")}</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
