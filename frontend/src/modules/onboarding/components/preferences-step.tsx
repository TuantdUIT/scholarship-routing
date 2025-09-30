"use client";

import type { OnboardingData } from "@/app/onboarding/page";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Label } from "@/core/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select";
import { useTranslations } from "next-intl";

interface PreferencesStepProps {
	data: OnboardingData;
	updateData: (data: Partial<OnboardingData>) => void;
}

export function PreferencesStep({ data, updateData }: PreferencesStepProps) {
	const t = useTranslations("onboarding");
	const countries = [
		"united_states",
		"united_kingdom",
		"canada",
		"australia",
		"germany",
		"netherlands",
		"sweden",
		"norway",
		"denmark",
		"switzerland",
		"france",
		"japan",
		"south_korea",
		"singapore",
		"new_zealand",
	];

	const degreeTypes = [
		"masters_degree",
		"phd",
		"professional_degree",
		"research_fellowship",
	];

	const scholarshipAmounts = [
		"partial_tuition",
		"full_tuition",
		"full_tuition_living_expenses",
		"any_amount",
	];
	const handleCountryChange = (country: string, checked: boolean) => {
		const updatedCountries = checked
			? [...data.desiredCountries, country]
			: data.desiredCountries.filter((c) => c !== country);
		updateData({ desiredCountries: updatedCountries });
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">{t("study_destinations")}</CardTitle>
					<CardDescription>
						{t("select_study_destinations")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
						{countries.map((country) => (
							<div key={country} className="flex items-center space-x-2">
								<Checkbox
									id={country}
									checked={data.desiredCountries.includes(country)}
									onCheckedChange={(checked) =>
										handleCountryChange(country, checked as boolean)
									}
								/>
								<Label
									htmlFor={country}
									className="text-sm font-normal cursor-pointer"
								>
									{t(country)}
								</Label>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="desiredDegree">{t("desired_degree_type")}</Label>
					<Select
						value={data.desiredDegree}
						onValueChange={(value) => updateData({ desiredDegree: value })}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("select_degree_type")} />
						</SelectTrigger>
						<SelectContent>
							{degreeTypes.map((degree) => (
								<SelectItem key={degree} value={t(degree)}>
									{t(degree)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="scholarshipAmount">{t("scholarship_coverage")}</Label>
					<Select
						value={data.scholarshipAmount}
						onValueChange={(value) => updateData({ scholarshipAmount: value })}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("select_preferred_coverage")} />
						</SelectTrigger>
						<SelectContent>
							{scholarshipAmounts.map((amount) => (
								<SelectItem key={amount} value={t(amount)}>
									{t(amount)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="bg-green-50 border border-green-200 rounded-lg p-4">
				<p className="text-sm text-green-800">
					<strong>{t("smart_matching_message")}</strong>
				</p>
			</div>
		</div>
	);
}
