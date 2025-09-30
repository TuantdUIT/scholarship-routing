"use client";

import type React from "react";

import type { OnboardingData } from "@/app/onboarding/page";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import { Edit, FileText, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

interface ReviewStepProps {
	data: OnboardingData;
	updateData: (data: Partial<OnboardingData>) => void;
}

export function ReviewStep({ data, updateData }: ReviewStepProps) {
	const t = useTranslations("onboarding");
	const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			updateData({ cvFile: file });
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center mb-6">
				<h3 className="text-lg font-semibold mb-2">
					{t("review_your_information")}
				</h3>
				<p className="text-muted-foreground">{t("review_details_message")}</p>
			</div>

			{/* Basic Information */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div>
						<CardTitle className="text-base">
							{t("basic_information")}
						</CardTitle>
						<CardDescription>
							{t("personal_details_education")}
						</CardDescription>
					</div>
					<Button variant="ghost" size="sm">
						<Edit className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium">{t("name")}</span> {data.name}
						</div>
						<div>
							<span className="font-medium">{t("email")}</span> {data.email}
						</div>
						<div>
							<span className="font-medium">{t("nationality")}</span>{" "}
							{data.nationality}
						</div>
						<div>
							<span className="font-medium">{t("current_education_level")}</span>{" "}
							{data.currentLevel}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Academic Information */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div>
						<CardTitle className="text-base">
							{t("academic_background")}
						</CardTitle>
						<CardDescription>{t("gpa_field_of_study")}</CardDescription>
					</div>
					<Button variant="ghost" size="sm">
						<Edit className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium">{t("gpa")}</span> {data.gpa} /{" "}
							{data.gpaScale}
						</div>
						<div>
							<span className="font-medium">{t("major")}</span> {data.major}
						</div>
					</div>
					{data.transcriptFile && (
						<div className="text-sm">
							<span className="font-medium">{t("transcript")}</span>{" "}
							{data.transcriptFile.name}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Test Scores */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div>
						<CardTitle className="text-base">{t("test_scores")}</CardTitle>
						<CardDescription>
							{t("language_standardized_results")}
						</CardDescription>
					</div>
					<Button variant="ghost" size="sm">
						<Edit className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex flex-wrap gap-2">
						{data.ieltsScore && (
							<Badge variant="secondary">
								{t("ielts")}: {data.ieltsScore}
							</Badge>
						)}
						{data.toeflScore && (
							<Badge variant="secondary">
								{t("toefl")}: {data.toeflScore}
							</Badge>
						)}
						{data.greScore && (
							<Badge variant="outline">
								{t("gre")}: {data.greScore}
							</Badge>
						)}
						{data.gmatScore && (
							<Badge variant="outline">
								{t("gmat")}: {data.gmatScore}
							</Badge>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Preferences */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div>
						<CardTitle className="text-base">
							{t("study_preferences_title")}
						</CardTitle>
						<CardDescription>
							{t("desired_destinations_degree")}
						</CardDescription>
					</div>
					<Button variant="ghost" size="sm">
						<Edit className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent className="space-y-3">
					<div>
						<span className="font-medium text-sm">{t("countries")}</span>
						<div className="flex flex-wrap gap-1 mt-1">
							{data.desiredCountries.map((country) => (
								<Badge key={country} variant="outline" className="text-xs">
									{country}
								</Badge>
							))}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium">{t("degree")}</span>{" "}
							{data.desiredDegree}
						</div>
						<div>
							<span className="font-medium">{t("coverage")}</span>{" "}
							{data.scholarshipAmount}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* CV Upload */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">{t("cv_upload_optional")}</CardTitle>
					<CardDescription>{t("upload_cv_for_matching")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
						<div className="text-center">
							<Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
							<div className="mt-4">
								<Button variant="outline" asChild>
									<label htmlFor="cv-upload" className="cursor-pointer">
										<FileText className="mr-2 h-4 w-4" />
										{data.cvFile ? t("replace_cv") : t("upload_cv")}
									</label>
								</Button>
								<input
									id="cv-upload"
									type="file"
									accept=".pdf,.doc,.docx"
									onChange={handleCVUpload}
									className="hidden"
								/>
							</div>
							<p className="mt-2 text-sm text-muted-foreground">
								{t("transcript_file_types")}
							</p>
							{data.cvFile && (
								<p className="mt-2 text-sm text-green-600">
									{t("file_uploaded", { fileName: data.cvFile.name })}
								</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
