"use client";

import type { OnboardingData } from "@/app/onboarding/page";
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

interface BasicInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const t = useTranslations("onboarding");
  const countries = [
    "vietnam",
    "thailand",
    "singapore",
    "malaysia",
    "indonesia",
    "philippines",
    "india",
    "china",
    "south_korea",
    "japan",
    "other",
  ];

  const currentLevels = [
    "bachelors_degree",
    "masters_degree",
    "phd",
    "professional_degree",
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("full_name")}</Label>
          <Input
            id="name"
            placeholder={t("enter_full_name")}
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email_address")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("enter_email_address")}
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">{t("nationality")}</Label>
          <Select
            value={data.nationality}
            onValueChange={(value) => updateData({ nationality: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select_nationality")} />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={t(country)}>
                  {t(country)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentLevel">{t("current_education_level")}</Label>
          <Select
            value={data.currentLevel}
            onValueChange={(value) => updateData({ currentLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select_current_level")} />
            </SelectTrigger>
            <SelectContent>
              {currentLevels.map((level) => (
                <SelectItem key={level} value={t(level)}>
                  {t(level)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            placeholder="How should we call you?"
            value={data.displayName}
            onChange={(event) => updateData({ displayName: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={data.password}
            onChange={(event) => updateData({ password: event.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={data.gender}
            onValueChange={(value) => updateData({ gender: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date of Birth</Label>
          <Input
            id="birthDate"
            type="date"
            value={data.birthDate}
            onChange={(event) => updateData({ birthDate: event.target.value })}
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {t("required_fields_message")}
      </div>
    </div>
  );
}
