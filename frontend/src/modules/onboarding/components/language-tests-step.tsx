"use client";

import type { OnboardingData } from "@/app/[locale]/onboarding/page";
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
import { useTranslations } from "next-intl";

interface LanguageTestsStepProps {
	data: OnboardingData;
	updateData: (data: Partial<OnboardingData>) => void;
}

export function LanguageTestsStep({
	data,
	updateData,
}: LanguageTestsStepProps) {
	const t = useTranslations("onboarding");
	return (
		<div className="space-y-6">
			<div className="text-sm text-muted-foreground mb-4">
				{t("tip_update_scores_later")}
			</div>

			{/* English Proficiency Tests */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						{t("english_proficiency_tests")}
					</CardTitle>
					<CardDescription>{t("required_for_scholarships")}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="ielts">
								{t("ielts_score")}
								<Badge variant="secondary" className="ml-2">
									{t("overall_band")}
								</Badge>
							</Label>
							<Input
								id="ielts"
								type="number"
								step="0.5"
								min="0"
								max="9"
								placeholder="7.0"
								value={data.ieltsScore}
								onChange={(e) => updateData({ ieltsScore: e.target.value })}
							/>
							<p className="text-xs text-muted-foreground">Scale: 0-9</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="toefl">
								{t("toefl_score")}
								<Badge variant="secondary" className="ml-2">
									{t("ibt")}
								</Badge>
							</Label>
							<Input
								id="toefl"
								type="number"
								min="0"
								max="120"
								placeholder="100"
								value={data.toeflScore}
								onChange={(e) => updateData({ toeflScore: e.target.value })}
							/>
							<p className="text-xs text-muted-foreground">Scale: 0-120</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Standardized Tests */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">{t("standardized_tests")}</CardTitle>
					<CardDescription>{t("optional_for_programs")}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="gre">
								{t("gre_score")}
								<Badge variant="outline" className="ml-2">
									{t("optional")}
								</Badge>
							</Label>
							<Input
								id="gre"
								type="number"
								min="260"
								max="340"
								placeholder="320"
								value={data.greScore}
								onChange={(e) => updateData({ greScore: e.target.value })}
							/>
							<p className="text-xs text-muted-foreground">Scale: 260-340</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="gmat">
								{t("gmat_score")}
								<Badge variant="outline" className="ml-2">
									{t("optional")}
								</Badge>
							</Label>
							<Input
								id="gmat"
								type="number"
								min="200"
								max="800"
								placeholder="650"
								value={data.gmatScore}
								onChange={(e) => updateData({ gmatScore: e.target.value })}
							/>
							<p className="text-xs text-muted-foreground">Scale: 200-800</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<p className="text-sm text-blue-800">
					<strong>{t("tip_update_scores_later")}</strong>
				</p>
			</div>
		</div>
	);
}
