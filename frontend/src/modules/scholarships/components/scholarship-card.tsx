"use client";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/core/components/ui/popover";
import { Progress } from "@/core/components/ui/progress";
import { Separator } from "@/core/components/ui/separator";
import {
	BookmarkPlus,
	Calendar,
	CheckCircle,
	DollarSign,
	ExternalLink,
	Info,
	MapPin,
	XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { userService } from "@/core/services/user-service";

interface Scholarship {
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

interface ScholarshipCardProps {
	scholarship: Scholarship;
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
	const t = useTranslations("scholarship");
	const [isInterested, setIsInterested] = useState(scholarship.isInterested);
	const [isLoading, setIsLoading] = useState(false);

	const handleInterestClick = async () => {
		const user = userService.getUser();
		if (!user) {
			toast.error("Please log in to save scholarships.");
			return;
		}

		setIsLoading(true);
		try {
			if (isInterested) {
				await userService.removeScholarshipFromInterest(scholarship.id, user.id);
				toast.success(t("remove_from_interest_success"));
			} else {
				await userService.addScholarshipToInterest(user.id, {
					scholarship_id: scholarship.id,
					name: scholarship.title,
					open_date: scholarship.startDate,
					close_date: scholarship.deadline,
				});
				toast.success(t("add_to_interest_success"));
			}
			setIsInterested(!isInterested);
		} catch (error) {
			toast.error(t("interest_action_error"));
		} finally {
			setIsLoading(false);
		}
	};

	const getMatchScoreColor = (score: number) => {
		if (score >= 80) return "text-green-600";
		if (score >= 60) return "text-yellow-600";
		return "text-red-600";
	};

	const getMatchScoreVariant = (score: number) => {
		if (score >= 80) return "default";
		if (score >= 60) return "secondary";
		return "outline";
	};

	const getDaysUntilDeadline = (deadline: string) => {
		const deadlineDate = new Date(deadline);
		const today = new Date();
		const diffTime = deadlineDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const daysLeft = getDaysUntilDeadline(scholarship.deadline);
	const isUrgent = daysLeft <= 30;
	const isExpired = daysLeft < 0;

	return (
		<Card
			className={`hover:shadow-lg transition-shadow ${isUrgent && !isExpired ? "border-orange-200" : ""}`}
		>
			<CardHeader className="pb-3">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
					<div className="flex-1">
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
							<CardTitle className="text-lg leading-tight">
								{scholarship.title}
							</CardTitle>
							<div className="flex gap-2">
								{isUrgent && !isExpired && (
									<Badge variant="destructive" className="text-xs">
										{t("urgent")}
									</Badge>
								)}
								{isExpired && (
									<Badge
										variant="outline"
										className="text-xs text-muted-foreground"
									>
										{t("expired")}
									</Badge>
								)}
							</div>
						</div>
						<CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
							<span className="font-medium">{scholarship.provider}</span>
							<span className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								{scholarship.country}
							</span>
						</CardDescription>
					</div>
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-1 mt-2">
					{scholarship.tags.map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{tag}
						</Badge>
					))}
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Description */}
				<p className="text-sm text-muted-foreground line-clamp-2">
					{scholarship.description}
				</p>

				{/* Key Info */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
					<div className="flex items-center gap-2">
						<DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
						<div className="min-w-0">
							<div className="font-medium">{t("amount")}</div>
							<div className="text-muted-foreground truncate">
								{scholarship.amount}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
						<div className="min-w-0">
							<div className="font-medium">{t("deadline")}</div>
							<div
								className={`${isUrgent && !isExpired ? "text-black-600" : "text-muted-foreground"}`}
							>
								<div className="truncate">
									{new Date(scholarship.deadline).toLocaleDateString("en-GB")}
								</div>
								{/* {!isExpired && (
									<div className="text-xs">
										({t("days_left", { daysLeft: daysLeft })})
									</div>
								)} */}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
						<Badge variant="outline" className="text-xs">
							{scholarship.degreeLevel}
						</Badge>
					</div>
				</div>

				<Separator />

				{/* Actions */}
				<div className="flex flex-col gap-2">
					<Button asChild className="w-full min-h-[44px]">
						<Link href={`/scholarships/${scholarship.id}`}>
							{t("view_details")}
						</Link>
					</Button>
					<div className="flex flex-col sm:flex-row gap-2">
						<Button
							variant={isInterested ? "default" : "outline"}
							className="flex-1 min-h-[44px]"
							onClick={handleInterestClick}
							disabled={isLoading}
						>
							<BookmarkPlus className="mr-2 h-4 w-4" />
							{isLoading
								? t("loading")
								: isInterested
									? t("delete")
									: t("save")}
						</Button>
						<Button
							variant="outline"
							asChild
							className="flex-1 min-h-[44px] bg-transparent"
						>
							<a
								href={scholarship.link}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center"
							>
								<ExternalLink className="mr-2 h-4 w-4" />
								{t("official_site")}
							</a>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
