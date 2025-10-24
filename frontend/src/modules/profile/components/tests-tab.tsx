"use client";

import { Badge } from "@/core/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Progress } from "@/core/components/ui/progress";
import { useState } from "react";
import { profileTestScores } from "@/modules/profile/data/profile-mocks";
import type { TestScore } from "@/modules/profile/data/profile-types";

interface TestsTabProps {
	isEditMode: boolean;
}

export function TestsTab({ isEditMode }: TestsTabProps) {
	const [testScores, setTestScores] = useState<TestScore[]>(() =>
		profileTestScores.map((test) => ({ ...test })),
	);

	const updateTestScore = (
		index: number,
		field: keyof TestScore,
		value: string,
	) => {
		setTestScores((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [field]: value };
			return updated;
		});
	};

	const getScorePercentage = (score: string, maxScore: number) => {
		const numScore = Number.parseFloat(score);
		return Number.isNaN(numScore) ? 0 : (numScore / maxScore) * 100;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "valid":
				return "default";
			case "expired":
				return "destructive";
			case "pending":
				return "outline";
			default:
				return "outline";
		}
	};

	const getScoreColor = (percentage: number) => {
		if (percentage >= 80) return "text-green-600";
		if (percentage >= 60) return "text-yellow-600";
		return "text-red-600";
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold">Test Scores</h3>
				<p className="text-sm text-muted-foreground">
					Your standardized test results for scholarship applications
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{testScores.map((test, index) => {
					const scorePercentage = getScorePercentage(test.score, test.maxScore);
					return (
						<Card key={test.type}>
							<CardHeader className="pb-3">
								<div className="flex justify-between items-center">
									<CardTitle className="text-base">{test.type}</CardTitle>
									<Badge variant={getStatusColor(test.status)}>
										{test.status}
									</Badge>
								</div>
								{test.type === "IELTS" && (
									<CardDescription>
										International English Language Testing System
									</CardDescription>
								)}
								{test.type === "TOEFL iBT" && (
									<CardDescription>
										Test of English as a Foreign Language
									</CardDescription>
								)}
								{test.type === "GRE" && (
									<CardDescription>Graduate Record Examination</CardDescription>
								)}
								{test.type === "GMAT" && (
									<CardDescription>
										Graduate Management Admission Test
									</CardDescription>
								)}
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>Score</Label>
									{isEditMode ? (
										<Input
											type="number"
											value={test.score}
											onChange={(e) =>
												updateTestScore(index, "score", e.target.value)
											}
											placeholder={"Max: " + test.maxScore}
											step={test.type === "IELTS" ? "0.5" : "1"}
										/>
									) : (
										<div className="flex items-center space-x-2">
											<span
												className={[
													"text-lg font-semibold",
													getScoreColor(scorePercentage),
												].join(" ")}
											>
												{test.score || "Not taken"}
											</span>
											{test.score && (
												<span className="text-sm text-muted-foreground">
													/ {test.maxScore}
												</span>
											)}
										</div>
									)}
								</div>

								{test.score && (
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Performance</span>
											<span>{Math.round(scorePercentage)}%</span>
										</div>
										<Progress value={scorePercentage} className="h-2" />
									</div>
								)}

								<div className="space-y-2">
									<Label>Test Date</Label>
									{isEditMode ? (
										<Input
											type="date"
											value={test.date}
											onChange={(e) =>
												updateTestScore(index, "date", e.target.value)
											}
										/>
									) : (
										<div className="p-2 text-sm">
											{test.date
												? new Date(test.date).toLocaleDateString()
												: "Not scheduled"}
										</div>
									)}
								</div>

								{test.date && (
									<div className="text-xs text-muted-foreground">
										{test.type === "IELTS" || test.type === "TOEFL iBT"
											? "Valid for 2 years"
											: "Valid for 5 years"}
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
