"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { useToast } from "@/core/components/ui/use-toast";
import { useAuth } from "@/core/providers/auth-provider";
import { authApi, type UpdateProfilePayload, type UserProfile } from "@/core/services/auth-api";
import {
  CVUploadModal,
} from "@/modules/profile/components/cv-upload-modal";
import { DocumentsTab } from "@/modules/profile/components/documents-tab";
import { EducationTab } from "@/modules/profile/components/education-tab";
import { ExperienceTab } from "@/modules/profile/components/experience-tab";
import { ExtracurricularsTab } from "@/modules/profile/components/extracurriculars-tab";
import { PersonalInfoTab } from "@/modules/profile/components/personal-info-tab";
import { PublicationsTab } from "@/modules/profile/components/publications-tab";
import { TestsTab } from "@/modules/profile/components/tests-tab";
import type {
  PersonalInfo,
  UserProfileSummary,
} from "@/modules/profile/data/profile-types";
import {
  Award,
  BookOpen,
  Briefcase,
  Download,
  Edit,
  FileCheck,
  GraduationCap,
  Loader2,
  Upload,
  User,
} from "lucide-react";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

const ISO_DATE_LENGTH = 10;

const emptyPersonalInfo: PersonalInfo = {
  name: null,
  email: null,
  phone: null,
  nationality: null,
  currentLevel: null,
  dateOfBirth: null,
  address: null,
  bio: null,
};

const asString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const firstString = (values: unknown): string | null => {
  if (!Array.isArray(values)) {
    return null;
  }
  const found = values.find((item): item is string => typeof item === "string" && item.trim().length > 0);
  return found ?? null;
};

const normalizeDate = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }
  return value.length >= ISO_DATE_LENGTH ? value.slice(0, ISO_DATE_LENGTH) : null;
};

const mapProfileToPersonalInfo = (
  profile: UserProfile | null,
  fallback: PersonalInfo,
  authEmail?: string | null,
  authName?: string | null,
): PersonalInfo => {
  const base: PersonalInfo = { ...fallback };

  base.name =
    asString(profile?.display_name) ??
    asString(profile?.name) ??
    asString(authName) ??
    base.name;

  base.email = asString(profile?.email) ?? asString(authEmail) ?? base.email;
  base.nationality = firstString(profile?.desired_countries) ?? base.nationality;
  base.currentLevel = asString(profile?.degree) ?? base.currentLevel;
  base.dateOfBirth = normalizeDate(profile?.birth_date) ?? base.dateOfBirth;
  base.address = asString(profile?.special_things) ?? base.address;
  base.bio = asString(profile?.notes) ?? base.bio;

  return base;
};

const computeCompleteness = (info: PersonalInfo) => {
  const considered = [
    info.name,
    info.email,
    info.nationality,
    info.currentLevel,
    info.dateOfBirth,
    info.bio,
    info.address,
  ];
  const filled = considered.filter((value) => typeof value === "string" && value.trim().length > 0).length;
  return Math.min(100, Math.round((filled / considered.length) * 100));
};

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { toast } = useToast();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    refreshUser,
  } = useAuth();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showCVUpload, setShowCVUpload] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(emptyPersonalInfo);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: "personal", label: t("personal"), icon: User },
    { id: "education", label: t("education"), icon: GraduationCap },
    { id: "tests", label: t("tests"), icon: Award },
    { id: "experience", label: t("experience"), icon: Briefcase },
    { id: "publications", label: t("publications"), icon: BookOpen },
    {
      id: "extracurriculars",
      label: t("extracurriculars"),
      icon: Award,
    },
    { id: "documents", label: t("documents"), icon: FileCheck },
  ];

  const mergePersonalInfo = useCallback(
    (profileData: UserProfile | null) => {
    setPersonalInfo((prev) => {
        const fallback = { ...emptyPersonalInfo, phone: prev.phone };
        return mapProfileToPersonalInfo(profileData, fallback, user?.email ?? null, user?.name ?? null);
      });
    },
    [user?.email, user?.name],
  );

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      return;
    }
    setIsProfileLoading(true);
    setLoadError(null);
    try {
      const data = await authApi.getProfile(user.id);
      setProfile(data);
      mergePersonalInfo(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setProfile(null);
        mergePersonalInfo(null);
      } else {
        console.error("Failed to load profile", error);
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { detail?: string })?.detail ?? error.message
          : t("profile_loading_error");
        setLoadError(message);
      }
    } finally {
      setIsProfileLoading(false);
    }
  }, [mergePersonalInfo, t, user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [loadProfile, user?.id]);

  useEffect(() => {
    if (!user?.name && !user?.email) {
      return;
    }
    setPersonalInfo((prev) => ({
      ...prev,
      name: asString(user?.name) ?? prev.name,
      email: asString(user?.email) ?? prev.email,
    }));
  }, [user?.name, user?.email]);

  const handlePersonalInfoChange = (update: Partial<PersonalInfo>) => {
    setPersonalInfo((prev) => ({ ...prev, ...update }));
  };

  const buildUpdatePayload = (): UpdateProfilePayload => {
    const payload: UpdateProfilePayload = {
      name: personalInfo.name || undefined,
      birth_date: personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth).toISOString() : undefined,
      desired_countries: personalInfo.nationality ? [personalInfo.nationality] : undefined,
      degree: personalInfo.currentLevel || undefined,
      notes: personalInfo.bio || undefined,
      special_things: personalInfo.address || undefined,
    };

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        // @ts-expect-error dynamic cleanup
        delete payload[key];
      }
    });

    return payload;
  };

  const handleSave = useCallback(async () => {
    if (!user?.id) {
      return false;
    }
    setIsSaving(true);
    try {
      const payload = buildUpdatePayload();
      const updated = await authApi.updateProfile(user.id, payload);
      setProfile(updated);
      mergePersonalInfo(updated);
      await refreshUser();
      toast({ title: t("profile_update_success") });
      return true;
    } catch (error) {
      console.error("Unable to update profile", error);
      const description = axios.isAxiosError(error)
        ? (error.response?.data as { detail?: string })?.detail ?? error.message
        : t("profile_update_error");
      toast({
        variant: "destructive",
        title: t("profile_update_error"),
        description,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [mergePersonalInfo, personalInfo, refreshUser, t, toast, user?.id]);

  const handleEditClick = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }
    const success = await handleSave();
    if (success) {
      setIsEditMode(false);
    }
  };

  const summary: UserProfileSummary = useMemo(() => {
    const completeness = computeCompleteness(personalInfo);
    const profileId = asString(profile?.uid) ?? "";
    const displayName =
      personalInfo.name ??
      asString(profile?.display_name) ??
      asString(profile?.name) ??
      asString(user?.name) ??
      "";
    const email =
      personalInfo.email ??
      asString(profile?.email) ??
      asString(user?.email) ??
      "";
    const nationality = personalInfo.nationality ?? firstString(profile?.desired_countries) ?? "";
    const level = personalInfo.currentLevel ?? asString(profile?.degree) ?? "";
    const major = asString(profile?.field_of_study) ?? "";
    const gpa = typeof profile?.gpa_range_4 === "number" ? profile.gpa_range_4 : null;
    const avatar = asString(user?.avatar) ?? null;

    return {
      id: asString(user?.id) ?? profileId,
      name: displayName,
      email,
      nationality,
      level,
      major,
      gpa,
      gpaScale: gpa !== null ? 4 : null,
      ielts: null, // TODO: Add IELTS score from test scores
      gre: null, // TODO: Add GRE score from test scores
      avatar,
      matchScore: 0,
      profileCompleteness: completeness,
    };
  }, [personalInfo, profile, user?.avatar, user?.email, user?.id, user?.name]);

  const showAuthPrompt = !authLoading && !isAuthenticated;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {showAuthPrompt ? (
          <Alert variant="destructive" className="mb-6">
                            <AlertTitle>{t("authentication_required_title")}</AlertTitle>
                <AlertDescription>{t("authentication_required_description")}</AlertDescription>
          </Alert>
        ) : null}

        {loadError ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{t("profile_loading_error")}</AlertTitle>
            <AlertDescription>{loadError}</AlertDescription>
            <div className="mt-4">
              <Button variant="outline" onClick={loadProfile} disabled={isProfileLoading}>
                {isProfileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                  {t("retry")}
              </Button>
            </div>
          </Alert>
        ) : null}

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={summary.avatar || "/placeholder.svg"} alt={summary.name} />
                  <AvatarFallback className="text-lg">
                    {summary.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{summary.name}</h1>
                  <p className="text-muted-foreground">{summary.email}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    {summary.level ? <Badge variant="secondary">{summary.level}</Badge> : null}
                    {summary.major ? <Badge variant="outline">{summary.major}</Badge> : null}
                    {summary.nationality ? <Badge variant="outline">{summary.nationality}</Badge> : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <Separator orientation="vertical" className="hidden h-12 sm:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{summary.profileCompleteness}%</div>
                  <div className="text-sm text-muted-foreground">{t("complete")}</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={isEditMode ? "default" : "outline"}
                onClick={handleEditClick}
                className="flex items-center"
                disabled={isProfileLoading || (!isEditMode && !isAuthenticated) || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="mr-2 h-4 w-4" />
                )}
                {isEditMode ? (isSaving ? t("profile_saving") : t("save_changes")) : t("edit_profile")}
              </Button>
              <Button variant="outline" onClick={() => setShowCVUpload(true)} className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                                  {t("upload_cv")}
              </Button>
              <Button variant="outline" className="flex items-center bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                                  {t("export_pdf")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
                            <CardTitle>{t("profile_details")}</CardTitle>
                <CardDescription>{t("manage_profile_documents")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-1">
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-6">
                <TabsContent value="personal">
                  <PersonalInfoTab
                    isEditMode={isEditMode}
                    data={personalInfo}
                    onChange={handlePersonalInfoChange}
                    isSaving={isSaving}
                  />
                </TabsContent>
                <TabsContent value="education">
                  <EducationTab isEditMode={isEditMode} />
                </TabsContent>
                <TabsContent value="tests">
                  <TestsTab isEditMode={isEditMode} />
                </TabsContent>
                <TabsContent value="experience">
                  <ExperienceTab isEditMode={isEditMode} />
                </TabsContent>
                <TabsContent value="publications">
                  <PublicationsTab isEditMode={isEditMode} />
                </TabsContent>
                <TabsContent value="extracurriculars">
                  <ExtracurricularsTab isEditMode={isEditMode} />
                </TabsContent>
                <TabsContent value="documents">
                  <DocumentsTab isEditMode={isEditMode} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <CVUploadModal open={showCVUpload} onOpenChange={setShowCVUpload} />
      </div>
    </div>
  );
}


