"use client";

import type React from "react";

import type { OnboardingData } from "@/app/onboarding/page";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select";
import { FileText, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

interface AcademicStepProps {
	data: OnboardingData;
	updateData: (data: Partial<OnboardingData>) => void;
}

export function AcademicStep({ data, updateData }: AcademicStepProps) {
	const t = useTranslations("onboarding");
	const gpaScales = ["4.0", "10.0", "100"];

	const majors = [
		"computer_science",
		"data_science",
		"engineering",
		"business_administration",
		"economics",
		"medicine",
		"law",
		"psychology",
		"biology",
		"chemistry",
		"physics",
		"mathematics",
		"literature",
		"history",
		"art",
		"other",
	];
	const handleTranscriptUpload = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			updateData({ transcriptFile: file });
		}
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="gpa">{t("gpa")}</Label>
					<Input
						id="gpa"
						type="number"
						step="0.01"
						placeholder="3.50"
						value={data.gpa}
						onChange={(e) => updateData({ gpa: e.target.value })}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="gpaScale">{t("gpa_scale")}</Label>
					<Select
						value={data.gpaScale}
						onValueChange={(value) => updateData({ gpaScale: value })}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("select_gpa_scale")} />
						</SelectTrigger>
						<SelectContent>
							{gpaScales.map((scale) => (
								<SelectItem key={scale} value={scale}>
									{t(`scale_${scale.replace(".", "_")}`)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="major">{t("field_of_study_major")}</Label>
					<Select
						value={data.major}
						onValueChange={(value) => updateData({ major: value })}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("select_field_of_study")} />
						</SelectTrigger>
						<SelectContent>
							{majors.map((major) => (
								<SelectItem key={major} value={t(major)}>
									{t(major)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-4">
				<Label>{t("transcript_upload_optional")}</Label>
				<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
					<div className="text-center">
						<Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
						<div className="mt-4">
							<Button variant="outline" asChild>
								<label htmlFor="transcript-upload" className="cursor-pointer">
									<FileText className="mr-2 h-4 w-4" />
									{t("upload_transcript")}
								</label>
							</Button>
							<input
								id="transcript-upload"
								type="file"
								accept=".pdf,.doc,.docx"
								onChange={handleTranscriptUpload}
								className="hidden"
							/>
						</div>
						<p className="mt-2 text-sm text-muted-foreground">
							{t("transcript_file_types")}
						</p>
						{data.transcriptFile && (
							<p className="mt-2 text-sm text-green-600">
								{t("file_uploaded", {
									fileName: data.transcriptFile.name,
								})}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className="text-sm text-muted-foreground">
				{t("gpa_filter_message")}
			</div>
		</div>
	);
}
