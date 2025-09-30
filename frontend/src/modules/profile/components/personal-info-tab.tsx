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
import { useState } from "react";

interface PersonalInfoTabProps {
	isEditMode: boolean;
}

const countries = [
	"Vietnam",
	"Thailand",
	"Singapore",
	"Malaysia",
	"Indonesia",
	"Philippines",
	"India",
	"China",
	"South Korea",
	"Japan",
	"Other",
];

const currentLevels = [
	"Bachelor's Degree",
	"Master's Degree",
	"PhD",
	"Professional Degree",
];

export function PersonalInfoTab({ isEditMode }: PersonalInfoTabProps) {
	const t = useTranslations("profile");
	const [formData, setFormData] = useState({
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "+84 123 456 789",
		nationality: "Vietnam",
		currentLevel: "Master's Degree",
		dateOfBirth: "1995-06-15",
		address: "Ho Chi Minh City, Vietnam",
		bio: "Computer Science graduate student passionate about AI and machine learning research.",
	});

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
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
									value={formData.name}
									onChange={(e) => updateField("name", e.target.value)}
								/>
							) : (
								<div className="p-2 text-sm">{formData.name}</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">{t("email_address")}</Label>
							{isEditMode ? (
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) => updateField("email", e.target.value)}
								/>
							) : (
								<div className="p-2 text-sm">{formData.email}</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">{t("phone_number")}</Label>
							{isEditMode ? (
								<Input
									id="phone"
									value={formData.phone}
									onChange={(e) => updateField("phone", e.target.value)}
								/>
							) : (
								<div className="p-2 text-sm">{formData.phone}</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="dateOfBirth">{t("date_of_birth")}</Label>
							{isEditMode ? (
								<Input
									id="dateOfBirth"
									type="date"
									value={formData.dateOfBirth}
									onChange={(e) => updateField("dateOfBirth", e.target.value)}
								/>
							) : (
								<div className="p-2 text-sm">
									{new Date(formData.dateOfBirth).toLocaleDateString()}
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="nationality">{t("nationality")}</Label>
							{isEditMode ? (
								<Select
									value={formData.nationality}
									onValueChange={(value) => updateField("nationality", value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{countries.map((country) => (
											<SelectItem key={country} value={country}>
												{country}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<div className="p-2 text-sm">{formData.nationality}</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="currentLevel">
								{t("current_education_level")}
							</Label>
							{isEditMode ? (
								<Select
									value={formData.currentLevel}
									onValueChange={(value) => updateField("currentLevel", value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{currentLevels.map((level) => (
											<SelectItem key={level} value={level}>
												{level}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<div className="p-2 text-sm">{formData.currentLevel}</div>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">{t("address")}</Label>
						{isEditMode ? (
							<Input
								id="address"
								value={formData.address}
								onChange={(e) => updateField("address", e.target.value)}
							/>
						) : (
							<div className="p-2 text-sm">{formData.address}</div>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="bio">{t("bio_personal_statement")}</Label>
						{isEditMode ? (
							<Textarea
								id="bio"
								rows={4}
								value={formData.bio}
								onChange={(e) => updateField("bio", e.target.value)}
								placeholder={t("tell_us_about_yourself")}
							/>
						) : (
							<div className="p-2 text-sm">{formData.bio}</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
