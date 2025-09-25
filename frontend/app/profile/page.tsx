"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Download, Edit, Upload, User, GraduationCap, Award, Briefcase, BookOpen, FileCheck } from "lucide-react"
import { PersonalInfoTab } from "@/components/profile/personal-info-tab"
import { EducationTab } from "@/components/profile/education-tab"
import { TestsTab } from "@/components/profile/tests-tab"
import { ExperienceTab } from "@/components/profile/experience-tab"
import { PublicationsTab } from "@/components/profile/publications-tab"
import { ExtracurricularsTab } from "@/components/profile/extracurriculars-tab"
import { DocumentsTab } from "@/components/profile/documents-tab"
import { CVUploadModal } from "@/components/profile/cv-upload-modal"

// Mock user data
const mockUser = {
  id: "u1",
  name: "John Doe",
  email: "john.doe@example.com",
  nationality: "Vietnam",
  level: "Master's",
  major: "Computer Science",
  gpa: 3.4,
  gpaScale: 4.0,
  ielts: 7.0,
  gre: null,
  avatar: "/diverse-user-avatars.png",
  matchScore: 78,
  profileCompleteness: 85,
}

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [showCVUpload, setShowCVUpload] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "tests", label: "Tests", icon: Award },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "publications", label: "Publications", icon: BookOpen },
    { id: "extracurriculars", label: "Activities", icon: Award },
    { id: "documents", label: "Documents", icon: FileCheck },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                  <AvatarFallback className="text-lg">
                    {mockUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                  <p className="text-muted-foreground">{mockUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{mockUser.level}</Badge>
                    <Badge variant="outline">{mockUser.major}</Badge>
                    <Badge variant="outline">{mockUser.nationality}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{mockUser.matchScore}%</div>
                  <div className="text-sm text-muted-foreground">Match Score</div>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-12" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{mockUser.profileCompleteness}%</div>
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
                {isEditMode ? "Save Changes" : "Edit Profile"}
              </Button>
              <Button variant="outline" onClick={() => setShowCVUpload(true)} className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload CV
              </Button>
              <Button variant="outline" className="flex items-center bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Manage your academic profile and documents</CardDescription>
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
  )
}
