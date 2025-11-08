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
import { Separator } from "@/core/components/ui/separator";
import {
	BookmarkPlus,
	Calendar,
	DollarSign,
	ExternalLink,
	MapPin,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Scholarship {
	id: string;
	title: string;
	provider: string;
	country: string;
	degreeLevel: string;
	fundingLevel: string;
	fundingDetails: string;
	deadline: string;
	matchScore: number;
	hardConditionsPassed: boolean;
	failedConditions: string[];
	description: string;
	tags: string[];
	link: string;
}

interface ScholarshipCardProps {
	scholarship: Scholarship;
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
	const t = useTranslations("scholarship");

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
					{scholarship.tags.flatMap((tag) => 
						tag.split(',').map((splitTag) => splitTag.trim())
					).filter(tag => tag).map((tag, index) => (
						<Badge key={`${tag}-${index}`} variant="outline" className="text-xs">
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

				{/* Key Info - Horizontal Layout */}
				<div className="flex flex-col lg:flex-row gap-4 text-sm">
					{/* Funding Level */}
					<div className="flex items-start gap-2 flex-1">
						<DollarSign className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
						<div className="min-w-0">
							<div className="font-medium mb-1">Funding Level</div>
							<div className="flex flex-wrap gap-1">
								{scholarship.fundingLevel.split(',').map((fundingItem, index) => (
									<Badge key={`funding-${index}`} variant="outline" className="text-xs">
										{fundingItem.trim()}
									</Badge>
								))}
							</div>
						</div>
					</div>

					{/* Deadline */}
					<div className="flex items-start gap-2 flex-1">
						<Calendar className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
						<div className="min-w-0">
							<div className="font-medium mb-1">{t("deadline")}</div>
							<div className={`${isUrgent && !isExpired ? "text-black-600" : "text-muted-foreground"}`}>
								{new Date(scholarship.deadline).toLocaleDateString("en-GB")}
							</div>
						</div>
					</div>

					{/* Degree Level Badges */}
					<div className="flex flex-wrap gap-1 items-start flex-1">
						{scholarship.degreeLevel.split(',').map((degree, index) => (
							<Badge key={`degree-${index}`} variant="outline" className="text-xs">
								{degree.trim()}
							</Badge>
						))}
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
							variant="outline"
							className="flex-1 min-h-[44px] bg-transparent"
						>
							<BookmarkPlus className="mr-2 h-4 w-4" />
							{t("save")}
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
