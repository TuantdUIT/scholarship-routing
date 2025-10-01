"use client";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	educationDegreeTypes,
	educationEntries,
	educationGpaScales,
} from "@/modules/profile/data/profile-mocks";
import type {
	EducationEntry,
	EducationStatus,
} from "@/modules/profile/data/profile-types";

interface EducationTabProps {
	isEditMode: boolean;
}

const formatMonth = (value: string) => {
	if (!value) {
		return "Not set";
	}
	const [year, month] = value.split("-");
	const yearNum = Number(year);
	const monthNum = Number(month);
	if (!year || !month || Number.isNaN(yearNum) || Number.isNaN(monthNum)) {
		return "Not set";
	}
	const date = new Date(yearNum, monthNum - 1);
	if (Number.isNaN(date.getTime())) {
		return "Not set";
	}
	return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
};

export function EducationTab({ isEditMode }: EducationTabProps) {
	const t = useTranslations("profile");
	const [educations, setEducations] = useState<EducationEntry[]>(() =>
		educationEntries.map((education) => ({ ...education }))
	);

	const gpaScales = educationGpaScales;
	const degreeTypes = educationDegreeTypes;

	const addEducation = () => {
		const newEducation: EducationEntry = {
			id: Date.now().toString(),
			institution: "",
			degree: "",
			major: "",
			gpa: "",
			gpaScale: "4.0",
			startDate: "",
			endDate: "",
			status: "planned",
		};
		setEducations((prev) => [...prev, newEducation]);
	};

	const removeEducation = (id: string) => {
		setEducations((prev) => prev.filter((edu) => edu.id !== id));
	};

	const updateEducation = (
		id: string,
		field: keyof EducationEntry,
		value: string,
	) => {
		setEducations((prev) =>
			prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
		);
	};

	const getStatusColor = (status: EducationStatus) => {
		switch (status) {
			case "completed":
				return "default";
			case "in-progress":
				return "secondary";
			case "planned":
				return "outline";
			default:
				return "outline";
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h3 className="text-lg font-semibold">{t("education_history")}</h3>
					<p className="text-sm text-muted-foreground">
						{t("academic_background_qualifications")}
					</p>
				</div>
				{isEditMode && (
					<Button
						onClick={addEducation}
						size="sm"
						className="flex items-center"
					>
						<Plus className="mr-2 h-4 w-4" />
						{t("add_education")}
					</Button>
				)}
			</div>

			<div className="space-y-4">
				{educations.map((education) => (
					<Card key={education.id}>
						<CardHeader className="pb-3">
							<div className="flex justify-between items-start">
								<div className="flex items-center space-x-2">
									<CardTitle className="text-base">
										{education.institution || t("new_institution")}
									</CardTitle>
									<Badge variant={getStatusColor(education.status)}>
										{education.status.replace("-", " ")}
									</Badge>
								</div>
								{isEditMode && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => removeEducation(education.id)}
										className="text-destructive hover:text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>{t("institution")}</Label>
									{isEditMode ? (
										<Input
											value={education.institution}
											onChange={(e) =>
												updateEducation(education.id, "institution", e.target.value)
											}
											placeholder={t("university_name")}
										/>
									) : (
										<div className="p-2 text-sm">{education.institution}</div>
									)}
								</div>

								<div className="space-y-2">
									<Label>{t("degree_type")}</Label>
									{isEditMode ? (
										<Select
											value={education.degree}
											onValueChange={(value) =>
												updateEducation(education.id, "degree", value)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder={t("select_degree")} />
											</SelectTrigger>
											<SelectContent>
												{degreeTypes.map((degree) => (
													<SelectItem key={degree} value={degree}>
														{degree}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<div className="p-2 text-sm">{education.degree}</div>
									)}
								</div>

								<div className="space-y-2">
									<Label>{t("major_field_of_study")}</Label>
									{isEditMode ? (
										<Input
											value={education.major}
											onChange={(e) =>
												updateEducation(education.id, "major", e.target.value)
											}
											placeholder="e.g. Computer Science"
										/>
									) : (
										<div className="p-2 text-sm">{education.major}</div>
									)}
								</div>

								<div className="space-y-2">
									<Label>{t("gpa")}</Label>
									{isEditMode ? (
										<div className="flex items-center space-x-2">
											<Input
												value={education.gpa}
												onChange={(e) =>
													updateEducation(education.id, "gpa", e.target.value)
											}
												placeholder="3.5"
											/>
											<Select
												value={education.gpaScale}
												onValueChange={(value) =>
													updateEducation(education.id, "gpaScale", value)
											}
											>
												<SelectTrigger className="w-24">
													<SelectValue placeholder="Scale" />
												</SelectTrigger>
												<SelectContent>
													{gpaScales.map((scale) => (
														<SelectItem key={scale} value={scale}>
															{scale}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									) : (
										<div className="p-2 text-sm">
											{education.gpa} / {education.gpaScale}
										</div>
									)}
								</div>

								<div className="space-y-2">
									<Label>Start Date</Label>
									{isEditMode ? (
										<Input
											type="month"
											value={education.startDate}
											onChange={(e) =>
												updateEducation(education.id, "startDate", e.target.value)
											}
										/>
									) : (
										<div className="p-2 text-sm">
											{formatMonth(education.startDate)}
										</div>
									)}
								</div>

								<div className="space-y-2">
									<Label>End Date</Label>
									{isEditMode ? (
										<Input
											type="month"
											value={education.endDate}
											onChange={(e) =>
												updateEducation(education.id, "endDate", e.target.value)
											}
										/>
									) : (
										<div className="p-2 text-sm">
											{education.endDate
													? formatMonth(education.endDate)
												: education.status === "in-progress"
													? "Present"
												: "Not set"}
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

