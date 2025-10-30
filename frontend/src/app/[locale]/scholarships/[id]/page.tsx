"use client";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/core/components/ui/tabs";
import { ApplicationTimeline } from "@/modules/scholarships/components/application-timeline";
import { DocumentsChecklist } from "@/modules/scholarships/components/documents-checklist";
import { EligibilityPanel } from "@/modules/scholarships/components/eligibility-panel";
import { RelatedScholarships } from "@/modules/scholarships/components/related-scholarships";
import {
	ArrowLeft,
	Award,
	BookmarkPlus,
	Calendar,
	CheckCircle,
	DollarSign,
	ExternalLink,
	FileText,
	MapPin,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getScholarship } from "@/core/services/scholarship-api";
import { Skeleton } from "@/core/components/ui/skeleton";

export default function ScholarshipDetailPage() {
	const params = useParams();
	const scholarshipId = params.id as string;
	const [scholarship, setScholarship] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isSaved, setIsSaved] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");

	useEffect(() => {
		if (scholarshipId) {
			const fetchScholarship = async () => {
				try {
					setLoading(true);
					const data = await getScholarship(scholarshipId);
					if (data) {
						setScholarship(data);
					} else {
						setError("Scholarship not found.");
					}
				} catch (err) {
					setError("Failed to fetch scholarship details.");
					console.error(err);
				} finally {
					setLoading(false);
				}
			};
			fetchScholarship();
		}
	}, [scholarshipId]);

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto max-w-6xl px-4 py-8">
					<Skeleton className="h-8 w-48 mb-6" />
					<Card className="mb-8">
						<CardHeader>
							<Skeleton className="h-10 w-3/4" />
							<Skeleton className="h-6 w-1/2 mt-2" />
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
								<Skeleton className="h-16" />
								<Skeleton className="h-16" />
								<Skeleton className="h-16" />
							</div>
							<div className="flex gap-3">
								<Skeleton className="h-12 flex-1" />
								<Skeleton className="h-12 w-32" />
								<Skeleton className="h-12 w-32" />
							</div>
						</CardContent>
					</Card>
					<Skeleton className="h-96 w-full" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Card className="max-w-md">
					<CardContent className="text-center py-8">
						<h2 className="text-xl font-semibold mb-2">Error</h2>
						<p className="text-muted-foreground mb-4">{error}</p>
						<Button asChild>
							<Link href="/scholarships">Back to Search</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!scholarship) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Card className="max-w-md">
					<CardContent className="text-center py-8">
						<h2 className="text-xl font-semibold mb-2">
							Scholarship Not Found
						</h2>
						<p className="text-muted-foreground mb-4">
							The scholarship you're looking for doesn't exist.
						</p>
						<Button asChild>
							<Link href="/scholarships">Back to Search</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getDaysUntilDeadline = (deadline: string) => {
		if (!deadline) return 0;
		const deadlineDate = new Date(deadline);
		const today = new Date();
		const diffTime = deadlineDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const daysLeft = getDaysUntilDeadline(scholarship.End_Date);
	const isUrgent = daysLeft <= 30;
	const isExpired = daysLeft < 0;

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-6xl px-4 py-8">
				{/* Back Navigation */}
				<div className="mb-6">
					<Button variant="ghost" asChild className="mb-4">
						<Link href="/scholarships" className="flex items-center">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Search
						</Link>
					</Button>
				</div>

				{/* Header */}
				<Card className="mb-8">
					<CardHeader>
						<div className="flex flex-col lg:flex-row justify-between items-start gap-6">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-3">
									<CardTitle className="text-2xl lg:text-3xl">
										{scholarship.Scholarship_Name}
									</CardTitle>
									{isUrgent && !isExpired && (
										<Badge variant="destructive">Urgent</Badge>
									)}
									{isExpired && (
										<Badge variant="outline" className="text-muted-foreground">
											Expired
										</Badge>
									)}
								</div>

								<div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
									<span className="font-medium text-foreground">
										{scholarship.Scholarship_Type}
									</span>
									<span className="flex items-center gap-1">
										<MapPin className="h-4 w-4" />
										{scholarship.Country}
									</span>
									<Badge variant="outline">{scholarship.Required_Degree}</Badge>
								</div>

								<div className="flex flex-wrap gap-2">
									{/* {scholarship.tags?.map((tag: string) => (
										<Badge key={tag} variant="secondary" className="text-xs">
											{tag}
										</Badge>
									))} */}
								</div>
							</div>

							{/* Match Score & Actions */}
							<div className="flex flex-col items-center gap-4">
								<div className="text-center">
									<div className="text-sm text-muted-foreground">
										Match Score
									</div>
								</div>

								<div className="flex gap-2">
									<Button
										variant={isSaved ? "default" : "outline"}
										onClick={() => setIsSaved(!isSaved)}
										className="flex items-center"
									>
										<BookmarkPlus className="mr-2 h-4 w-4" />
										{isSaved ? "Saved" : "Save"}
									</Button>
									<Button variant="outline" asChild>
										<a
											href={scholarship.Url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center"
										>
											<ExternalLink className="mr-2 h-4 w-4" />
											Official Site
										</a>
									</Button>
								</div>
							</div>
						</div>
					</CardHeader>

					<CardContent>
						{/* Key Information */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-lg">
									<DollarSign className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<div className="font-medium">Scholarship Amount</div>
									<div className="text-sm text-muted-foreground">
										{scholarship.Funding_Details || scholarship.Funding_Level}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Calendar className="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<div className="font-medium">Application Deadline</div>
									<div
										className={`text-sm ${isUrgent && !isExpired ? "text-gray-600" : "text-muted-foreground"
											}`}
									>
										{scholarship?.End_Date
											? new Date(scholarship.End_Date).toLocaleDateString("en-GB")
											: "Invalid Date"}
										{!isExpired && scholarship?.End_Date && (
											<span className="ml-1">({daysLeft} days left)</span>
										)}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<Users className="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<div className="font-medium">Success Rate</div>
									<div className="text-sm text-muted-foreground">
										{/* Placeholder for success rate */}
									</div>
								</div>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="flex flex-col sm:flex-row gap-3">
							<Button size="lg" className="flex-1" disabled={isExpired}>
								{isExpired ? "Application Closed" : "Start Application"}
							</Button>
							<Button variant="outline" size="lg">
								Contact Provider
							</Button>
							<Button variant="outline" size="lg">
								Download Info Sheet
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
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="eligibility">Eligibility</TabsTrigger>
						<TabsTrigger value="documents">Documents</TabsTrigger>
						<TabsTrigger value="process">Process</TabsTrigger>
						<TabsTrigger value="related">Similar</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>About This Scholarship</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground">
									{scholarship.Scholarship_Info}
								</p>
							</CardContent>
						</Card>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Award className="h-5 w-5" />
										Benefits & Support
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{/* Placeholder for benefits */}
									</ul>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileText className="h-5 w-5" />
										Selection Criteria
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{/* Placeholder for selection criteria */}
									</ul>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Application Statistics</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{/* Placeholders for statistics */}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="eligibility">
						<EligibilityPanel scholarship={scholarship} />
					</TabsContent>

					<TabsContent value="documents">
						<DocumentsChecklist scholarship={scholarship} />
					</TabsContent>

					<TabsContent value="process">
						<ApplicationTimeline scholarship={scholarship} />
					</TabsContent>

					<TabsContent value="related">
						<RelatedScholarships currentScholarshipId={scholarshipId} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
