"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/core/components/ui/avatar";
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
import { CVUploadModal } from "@/modules/profile/components/cv-upload-modal";
import { DocumentsTab } from "@/modules/profile/components/documents-tab";
import { EducationTab } from "@/modules/profile/components/education-tab";
import { ExperienceTab } from "@/modules/profile/components/experience-tab";
import { ExtracurricularsTab } from "@/modules/profile/components/extracurriculars-tab";
import { PersonalInfoTab } from "@/modules/profile/components/personal-info-tab";
import { PublicationsTab } from "@/modules/profile/components/publications-tab";
import { TestsTab } from "@/modules/profile/components/tests-tab";
import { mockUserProfile } from "@/modules/profile/data/profile-mocks";
import type { UserProfileSummary } from "@/modules/profile/data/profile-types";
import {
	Award,
	BookOpen,
	Briefcase,
	Download,
	Edit,
	FileCheck,
	GraduationCap,
	Upload,
	User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ProfilePage() {
	const t = useTranslations("profile");
	const [isEditMode, setIsEditMode] = useState(false);
	const [showCVUpload, setShowCVUpload] = useState(false);
	const [activeTab, setActiveTab] = useState("personal");
	const user: UserProfileSummary = mockUserProfile;

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

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-6xl px-4 py-8">
				{/* Profile Header */}
				<Card className="mb-8">
					<CardHeader>
						<div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
							<div className="flex items-center space-x-4">
								<Avatar className="h-20 w-20">
									<AvatarImage
										src={user.avatar || "/placeholder.svg"}
										alt={user.name}
									/>
									<AvatarFallback className="text-lg">
										{user.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div>
									<h1 className="text-2xl font-bold">{user.name}</h1>
									<p className="text-muted-foreground">{user.email}</p>
									<div className="flex items-center space-x-2 mt-2">
										<Badge variant="secondary">{user.level}</Badge>
										<Badge variant="outline">{user.major}</Badge>
										<Badge variant="outline">{user.nationality}</Badge>
									</div>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
								<Separator
									orientation="vertical"
									className="hidden sm:block h-12"
								/>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										{user.profileCompleteness}%
									</div>
									<div className="text-sm text-muted-foreground">Complete</div>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							<Button
								variant={isEditMode ? "default" : "outline"}
								onClick={() => setIsEditMode(!isEditMode)}
								className="flex items-center"
							>
								<Edit className="mr-2 h-4 w-4" />
								{isEditMode ? t("save_changes") : t("edit_profile")}
							</Button>
							<Button
								variant="outline"
								onClick={() => setShowCVUpload(true)}
								className="flex items-center"
							>
								<Upload className="mr-2 h-4 w-4" />
								{t("upload_cv")}
							</Button>
							<Button
								variant="outline"
								className="flex items-center bg-transparent"
							>
								<Download className="mr-2 h-4 w-4" />
								{t("export_pdf")}
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Profile Tabs */}
				<Card>
					<CardHeader>
						<CardTitle>{t("profile_details")}</CardTitle>
						<CardDescription>
							{t("manage_profile_documents")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full"
						>
							<TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
								{tabs.map((tab) => (
									<TabsTrigger
										key={tab.id}
										value={tab.id}
										className="flex items-center space-x-1"
									>
										<tab.icon className="h-4 w-4" />
										<span className="hidden sm:inline">{tab.label}</span>
									</TabsTrigger>
								))}
							</TabsList>

							<div className="mt-6">
								<TabsContent value="personal">
									<PersonalInfoTab isEditMode={isEditMode} />
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

				{/* CV Upload Modal */}
				<CVUploadModal open={showCVUpload} onOpenChange={setShowCVUpload} />
			</div>
		</div>
	);
}
