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
import { Checkbox } from "@/core/components/ui/checkbox";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface Filters {
	countries: string[];
	degreeLevel: string;
	minAmount: string;
	maxGpa: string;
	minIelts: string;
	fields: string[];
	deadlineRange: string;
	onlyPassed: boolean;
}

interface ScholarshipFiltersProps {
	filters: Filters;
	onFiltersChange: (filters: Filters) => void;
}

const countries = [
	"Hoa Kỳ",
	"Vương quốc Anh",
	"Canada",
	"Úc",
	"Đức",
	"Hà Lan",
	"Thụy Điển",
	"Na Uy",
	"Đan Mạch",
	"Thụy Sĩ",
	"Pháp",
	"Nhật Bản",
	"Hàn Quốc",
	"Singapore",
];

const fields = [
	"Khoa học máy tính",
	"Khoa học dữ liệu",
	"Kỹ thuật",
	"Quản trị kinh doanh",
	"Kinh tế",
	"Y học",
	"Luật",
	"Tâm lý học",
	"Sinh học",
	"Hóa học",
	"Vật lý",
	"Toán học",
];

const degreeLevels = [
	"Cử nhân",
	"Thạc sĩ",
	"Tiến sĩ",
	"Bằng cấp chuyên nghiệp",
];

export function ScholarshipFilters({
	filters,
	onFiltersChange,
}: ScholarshipFiltersProps) {
	const t = useTranslations("scholarship");

	const updateFilter = (key: keyof Filters, value: any) => {
		onFiltersChange({ ...filters, [key]: value });
	};

	const toggleCountry = (country: string) => {
		const updated = filters.countries.includes(country)
			? filters.countries.filter((c) => c !== country)
			: [...filters.countries, country];
		updateFilter("countries", updated);
	};

	const toggleField = (field: string) => {
		const updated = filters.fields.includes(field)
			? filters.fields.filter((f) => f !== field)
			: [...filters.fields, field];
		updateFilter("fields", updated);
	};

	const clearAllFilters = () => {
		onFiltersChange({
			countries: [],
			degreeLevel: "",
			minAmount: "",
			maxGpa: "",
			minIelts: "",
			fields: [],
			deadlineRange: "",
			onlyPassed: false,
		});
	};

	const hasActiveFilters = Object.values(filters).some((value) =>
		Array.isArray(value) ? value.length > 0 : Boolean(value),
	);

	return (
		<div className="space-y-4">
			{/* Filter Header */}
			<Card>
				<CardHeader className="pb-3">
					<div className="flex justify-between items-center">
						<CardTitle className="text-base">{t("filters")}</CardTitle>
						{hasActiveFilters && (
							<Button variant="ghost" size="sm" onClick={clearAllFilters}>
								{t("clear_all")}
							</Button>
						)}
					</div>
				</CardHeader>
			</Card>

			{/* Hard Conditions */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">{t("hard_requirements")}</CardTitle>
					<CardDescription>
						{t("hard_requirements_description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="space-y-2">
						<Label className="text-sm">{t("degree_level")}</Label>
						<Select
							value={filters.degreeLevel}
							onValueChange={(value) => updateFilter("degreeLevel", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder={t("select_degree_level")} />
							</SelectTrigger>
							<SelectContent>
								{degreeLevels.map((level) => (
									<SelectItem key={level} value={level}>
										{level}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{filters.degreeLevel && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => updateFilter("degreeLevel", "")}
								className="text-xs"
							>
								{t("uncheck")}
							</Button>
						)}
					</div>{" "}
					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-2">
							<Label className="text-sm">{t("max_gpa_required")}</Label>
							<Input
								type="number"
								step="0.1"
								placeholder="3.2"
								value={filters.maxGpa}
								onChange={(e) => updateFilter("maxGpa", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">{t("min_ielts_required")}</Label>
							<Input
								type="number"
								step="0.5"
								placeholder="6.5"
								value={filters.minIelts}
								onChange={(e) => updateFilter("minIelts", e.target.value)}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Countries */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">{t("countries")}</CardTitle>
					<CardDescription>{t("countries_description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{filters.countries.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{filters.countries.map((country) => (
									<Badge key={country} variant="secondary" className="text-xs">
										{country}
										<button
											onClick={() => toggleCountry(country)}
											className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
										>
											<X className="h-2 w-2" />
										</button>
									</Badge>
								))}
							</div>
						)}
						<div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
							{countries.map((country) => (
								<div key={country} className="flex items-center space-x-2">
									<Checkbox
										id={country}
										checked={filters.countries.includes(country)}
										onCheckedChange={() => toggleCountry(country)}
									/>
									<Label htmlFor={country} className="text-sm cursor-pointer">
										{country}
									</Label>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Fields of Study */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">{t("fields_of_study")}</CardTitle>
					<CardDescription>{t("fields_of_study_description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{filters.fields.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{filters.fields.map((field) => (
									<Badge key={field} variant="secondary" className="text-xs">
										{field}
										<button
											onClick={() => toggleField(field)}
											className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
										>
											<X className="h-2 w-2" />
										</button>
									</Badge>
								))}
							</div>
						)}
						<div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
							{fields.map((field) => (
								<div key={field} className="flex items-center space-x-2">
									<Checkbox
										id={field}
										checked={filters.fields.includes(field)}
										onCheckedChange={() => toggleField(field)}
									/>
									<Label htmlFor={field} className="text-sm cursor-pointer">
										{field}
									</Label>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Deadline */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">
						{t("application_deadline")}
					</CardTitle>
					<CardDescription>
						{t("application_deadline_description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Select
						value={filters.deadlineRange}
						onValueChange={(value) => updateFilter("deadlineRange", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("any_deadline")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="any">{t("any_deadline")}</SelectItem>
							<SelectItem value="next-month">{t("next_30_days")}</SelectItem>
							<SelectItem value="next-3-months">
								{t("next_3_months")}
							</SelectItem>
							<SelectItem value="next-6-months">
								{t("next_6_months")}
							</SelectItem>
							<SelectItem value="next-year">{t("next_year")}</SelectItem>
						</SelectContent>
					</Select>
				</CardContent>
			</Card>
		</div>
	);
}
