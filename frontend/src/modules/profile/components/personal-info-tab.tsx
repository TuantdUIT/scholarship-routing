"use client";

import {
	Card,
	CardContent,
	CardDescription,
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
import { Textarea } from "@/core/components/ui/textarea";
import { useTranslations } from "next-intl";
import { profileCountries, profileCurrentLevels } from "@/modules/profile/data/profile-mocks";
import type { PersonalInfo } from "@/modules/profile/data/profile-types";

interface PersonalInfoTabProps {
	isEditMode: boolean;
	data: PersonalInfo;
	onChange: (update: Partial<PersonalInfo>) => void;
	isSaving?: boolean;
}

const formatDateOfBirth = (value?: string | null) => {
	if (!value) {
		return "";
	}

	const parts = value.split("-");
	if (parts.length !== 3) {
		return value;
	}

	const [year, month, day] = parts;
	if (!year || !month || !day) {
		return value;
	}

	return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
};

const displayValue = (value?: string | null) => (value && value.trim().length > 0 ? value : "-");

const toInputValue = (value?: string | null) => value ?? "";

const toNullable = (value: string) => {
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
};

export function PersonalInfoTab({ isEditMode, data, onChange, isSaving = false }: PersonalInfoTabProps) {
	const t = useTranslations("profile");

	const updateField = (field: keyof PersonalInfo, value: string) => {
		onChange({ [field]: toNullable(value) } as Partial<PersonalInfo>);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>{t("basic_information")}</CardTitle>
					<CardDescription>
						{t("personal_details_contact")}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">{t("full_name")}</Label>
							{isEditMode ? (
								<Input
									id="name"
									value={toInputValue(data.name)}
									onChange={(e) => updateField("name", e.target.value)}
									disabled={isSaving}
								/>
							) : (
								<div className="p-2 text-sm">{displayValue(data.name)}</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">{t("email_address")}</Label>
							{isEditMode ? (
								<Input
									id="email"
									type="email"
									value={toInputValue(data.email)}
									onChange={(e) => updateField("email", e.target.value)}
									disabled={isSaving}
								/>
							) : (
								<div className="p-2 text-sm">{displayValue(data.email)}</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">{t("phone_number")}</Label>
							{isEditMode ? (
								<Input
									id="phone"
									value={toInputValue(data.phone)}
									onChange={(e) => updateField("phone", e.target.value)}
									disabled={isSaving}
								/>
							) : (
								<div className="p-2 text-sm">{displayValue(data.phone)}</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="dateOfBirth">{t("date_of_birth")}</Label>
							{isEditMode ? (
								<Input
									id="dateOfBirth"
									type="date"
									value={toInputValue(data.dateOfBirth)}
									onChange={(e) => updateField("dateOfBirth", e.target.value)}
									disabled={isSaving}
								/>
							) : (
								<div className="p-2 text-sm">
									{displayValue(formatDateOfBirth(data.dateOfBirth ?? undefined))}
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="nationality">{t("nationality")}</Label>
							{isEditMode ? (
								<Select
									value={toInputValue(data.nationality)}
									onValueChange={(value) => updateField("nationality", value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{profileCountries.map((country) => (
											<SelectItem key={country} value={country}>
												{country}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<div className="p-2 text-sm">{displayValue(data.nationality)}</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="currentLevel">
								{t("current_education_level")}
							</Label>
							{isEditMode ? (
								<Select
									value={toInputValue(data.currentLevel)}
									onValueChange={(value) => updateField("currentLevel", value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{profileCurrentLevels.map((level) => (
											<SelectItem key={level} value={level}>
												{level}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<div className="p-2 text-sm">{displayValue(data.currentLevel)}</div>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">{t("address")}</Label>
						{isEditMode ? (
							<Input
								id="address"
								value={toInputValue(data.address)}
								onChange={(e) => updateField("address", e.target.value)}
								disabled={isSaving}
							/>
						) : (
							<div className="p-2 text-sm">{displayValue(data.address)}</div>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="bio">{t("bio_personal_statement")}</Label>
						{isEditMode ? (
							<Textarea
								id="bio"
								rows={4}
								value={toInputValue(data.bio)}
								onChange={(e) => updateField("bio", e.target.value)}
								disabled={isSaving}
								placeholder={t("tell_us_about_yourself")}
							/>
						) : (
							<div className="p-2 text-sm">{displayValue(data.bio)}</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
