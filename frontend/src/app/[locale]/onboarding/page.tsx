"use client";

import { Button } from "@/core/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Progress } from "@/core/components/ui/progress";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/core/components/ui/alert";
import { authApi } from "@/core/services/auth-api";
import { useAuth } from "@/core/providers/auth-provider";
import axios from "axios";
import { FirebaseError } from "firebase/app";
import { AcademicStep } from "@/modules/onboarding/components/academic-step";
import { BasicInfoStep } from "@/modules/onboarding/components/basic-info-step";
import { LanguageTestsStep } from "@/modules/onboarding/components/language-tests-step";
import { PreferencesStep } from "@/modules/onboarding/components/preferences-step";
import { ReviewStep } from "@/modules/onboarding/components/review-step";
import { ArrowLeft, ArrowRight, CheckCircle, LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";

export interface OnboardingData {
	// Basic Info
	name: string;
	email: string;
	password: string;
	displayName: string;
	gender: string;
	birthDate: string;
	nationality: string;
	currentLevel: string;

	// Academic
	gpa: string;
	gpaScale: string;
	major: string;
	transcriptFile?: File;
	languageCertificates: string;
	academicCertificates: string;
	academicAwards: string;
	publications: string;

	// Standardized Tests
	ieltsScore?: string;
	toeflScore?: string;
	greScore?: string;
	gmatScore?: string;

	// Preferences
	desiredCountries: string[];
	desiredDegree: string;
	desiredScholarshipType: string[];
	desiredFundingLevel: string[];
	desiredApplicationMode: string[];
	desiredApplicationMonth: number;
	desiredFieldOfStudy: string[];
	scholarshipAmount: string;
	notes: string;
	degree: string;
	fieldOfStudy: string;
	tags: string[];
	specialThings: string;

	// Experience
	yearsOfExperience: number;
	totalWorkingHours: number;

	// CV
	cvFile?: File;
}

export default function OnboardingPage() {
	const t = useTranslations("onboarding");
	const router = useRouter();
	const searchParams = useSearchParams();
	const { signInWithEmail, signInWithGoogle, isAuthenticated } = useAuth();

	const redirectParam = searchParams.get("redirect");
	const redirectTarget =
		redirectParam && redirectParam.startsWith("/") ? redirectParam : "/profile";
	const loginMode = searchParams.get("mode");
	const cameFromRedirect = Boolean(redirectParam);

	const steps = useMemo(
		() => [
			{
				id: 1,
				title: t("basic_info"),
				description: t("personal_details"),
			},
			{
				id: 2,
				title: t("academic"),
				description: t("education_background"),
			},
			{
				id: 3,
				title: t("tests"),
				description: t("language_standardized_tests"),
			},
			{
				id: 4,
				title: t("preferences"),
				description: t("study_preferences"),
			},
			{
				id: 5,
				title: t("review"),
				description: t("confirm_details"),
			},
		],
		[t],
	);

	const [currentStep, setCurrentStep] = useState(1);
	const [data, setData] = useState<OnboardingData>({
		name: "",
		email: "",
		password: "",
		displayName: "",
		gender: "",
		birthDate: "",
		nationality: "",
		currentLevel: "",
		gpa: "",
		gpaScale: "4.0",
		major: "",
		ieltsScore: "",
		toeflScore: "",
		greScore: "",
		gmatScore: "",
		languageCertificates: "",
		academicCertificates: "",
		academicAwards: "",
		publications: "",
		desiredCountries: [],
		desiredDegree: "",
		desiredScholarshipType: [],
		desiredFundingLevel: [],
		desiredApplicationMode: [],
		desiredApplicationMonth: 0,
		desiredFieldOfStudy: [],
		scholarshipAmount: "",
		notes: "",
		degree: "",
		fieldOfStudy: "",
		tags: [],
		specialThings: "",
		yearsOfExperience: 0,
		totalWorkingHours: 0,
	});

	const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
	const [loginForm, setLoginForm] = useState({ email: "", password: "" });
	const [loginError, setLoginError] = useState<string | null>(null);
	const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionError, setSubmissionError] = useState<string | null>(null);

	const closeLoginDialog = () => {
		setIsLoginDialogOpen(false);
		setLoginError(null);
		setLoginForm({ email: "", password: "" });
		setIsGoogleSigningIn(false);
	};

	const handleLoginDialogChange = (open: boolean) => {
		if (open) {
			setIsLoginDialogOpen(true);
			return;
		}
		closeLoginDialog();
	};

	useEffect(() => {
		if (loginMode === "login") {
			setLoginError(null);
			setLoginForm({ email: "", password: "" });
			setIsGoogleSigningIn(false);
			setIsLoginDialogOpen(true);
		}
	}, [loginMode]);

	useEffect(() => {
		if (isAuthenticated) {
			router.replace(redirectTarget);
		}
	}, [isAuthenticated, redirectTarget, router]);

	const isLoginValid =
		loginForm.email.trim().length > 0 && loginForm.password.trim().length >= 6;

	const updateLoginField = (field: "email" | "password") => (value: string) =>
		setLoginForm((prev) => ({ ...prev, [field]: value }));

	const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoginError(null);
		if (!isLoginValid) {
			return;
		}

		const normalizedEmail = loginForm.email.trim().toLowerCase();

		try {
			await signInWithEmail(normalizedEmail, loginForm.password);
			closeLoginDialog();
			if (redirectParam) {
				router.replace(redirectTarget);
			}
		} catch (error) {
			setLoginError(formatErrorMessage(error));
		}
	};
	const handleGoogleSignIn = async () => {
		setLoginError(null);
		setIsGoogleSigningIn(true);
		try {
			await signInWithGoogle();
			closeLoginDialog();
			if (redirectParam) {
				router.replace(redirectTarget);
			}
		} catch (error) {
			setLoginError(formatErrorMessage(error));
		} finally {
			setIsGoogleSigningIn(false);
		}
	};

	const formatErrorMessage = (error: unknown) => {
		if (axios.isAxiosError(error)) {
			const data = error.response?.data as
				| { detail?: string; message?: string }
				| undefined;
			if (data?.detail) {
				return data.detail;
			}
			if (data?.message) {
				return data.message;
			}
			return error.message;
		}

		if (error instanceof FirebaseError) {
			switch (error.code) {
				case "auth/invalid-credential":
				case "auth/user-not-found":
				case "auth/wrong-password":
					return "Incorrect email or password.";
				case "auth/too-many-requests":
					return "Too many attempts. Please try again later.";
				case "auth/popup-blocked":
				case "auth/popup-closed-by-user":
				case "auth/cancelled-popup-request":
					return "Google sign-in was cancelled. Please try again.";
				default:
					return error.message;
			}
		}

		if (error instanceof Error) {
			return error.message;
		}

		return "Something went wrong. Please try again.";
	};

	const updateData = (newData: Partial<OnboardingData>) => {
		setSubmissionError(null);
		setData((prev) => {
			const next = { ...prev, ...newData };
			if (typeof newData.name === "string" && !prev.displayName) {
				next.displayName = newData.name;
			}
			return next;
		});
	};

	const buildRegisterPayload = (form: OnboardingData) => {
		const gpaValue = Number.parseFloat(form.gpa);
		const desiredScholarshipType = form.desiredScholarshipType ?? [];
		const desiredFundingLevel = form.desiredFundingLevel ?? [];
		const desiredApplicationMode = form.desiredApplicationMode ?? [];
		const desiredCountries = form.desiredCountries ?? [];
		const desiredFieldOfStudy = form.desiredFieldOfStudy ?? [];
		const tags = form.tags ?? [];

		const desiredDegreeArray = form.desiredDegree ? [form.desiredDegree] : [];
		const fundingLevelArray = form.scholarshipAmount
			? [form.scholarshipAmount]
			: [];
		const fallbackFieldOfStudy =
			desiredFieldOfStudy.length > 0
				? desiredFieldOfStudy
				: form.desiredDegree
					? [form.desiredDegree]
					: form.major
						? [form.major]
						: [];

		const languageCertificates = form.languageCertificates
			? form.languageCertificates
			: [form.ieltsScore, form.toeflScore, form.greScore, form.gmatScore]
					.filter((score) => score && score.trim().length > 0)
					.join(", ");

		return {
			email: form.email,
			password: form.password,
			display_name: form.displayName || form.name,
			name: form.name,
			gender: form.gender,
			birth_date: form.birthDate
				? new Date(form.birthDate).toISOString()
				: new Date().toISOString(),
			gpa_range_4: Number.isNaN(gpaValue) ? 0 : gpaValue,
			desired_scholarship_type:
				desiredScholarshipType.length > 0
					? desiredScholarshipType
					: desiredDegreeArray,
			desired_countries: desiredCountries,
			desired_funding_level:
				desiredFundingLevel.length > 0
					? desiredFundingLevel
					: fundingLevelArray,
			desired_application_mode: desiredApplicationMode,
			desired_application_month: form.desiredApplicationMonth ?? 0,
			desired_field_of_study: fallbackFieldOfStudy,
			notes: form.notes,
			degree: form.degree || form.currentLevel,
			field_of_study: form.fieldOfStudy || form.major,
			language_certificates: languageCertificates,
			academic_certificates: form.academicCertificates,
			academic_awards: form.academicAwards,
			publications: form.publications,
			years_of_experience: form.yearsOfExperience ?? 0,
			total_working_hours: form.totalWorkingHours ?? 0,
			tags,
			special_things: form.specialThings,
		};
	};

	const nextStep = () => {
		if (currentStep < steps.length) {
			setSubmissionError(null);
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setSubmissionError(null);
			setCurrentStep(currentStep - 1);
		}
	};

	const handleComplete = async () => {
		if (!isStepValid()) {
			return;
		}

		setIsSubmitting(true);
		setSubmissionError(null);

		try {
			const payload = buildRegisterPayload(data);
			await authApi.register(payload);
			await signInWithEmail(payload.email, data.password);
			router.replace(redirectTarget);
		} catch (error) {
			setSubmissionError(formatErrorMessage(error));
		} finally {
			setIsSubmitting(false);
		}
	};

	const progress = (currentStep / steps.length) * 100;

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return <BasicInfoStep data={data} updateData={updateData} />;
			case 2:
				return <AcademicStep data={data} updateData={updateData} />;
			case 3:
				return <LanguageTestsStep data={data} updateData={updateData} />;
			case 4:
				return <PreferencesStep data={data} updateData={updateData} />;
			case 5:
				return <ReviewStep data={data} updateData={updateData} />;
			default:
				return <BasicInfoStep data={data} updateData={updateData} />;
		}
	};

	const isStepValid = () => {
		switch (currentStep) {
			case 1:
				return (
					data.name &&
					data.email &&
					data.password &&
					data.displayName &&
					data.nationality &&
					data.currentLevel &&
					data.gender &&
					data.birthDate
				);
			case 2:
				return data.gpa && data.gpaScale && data.major;
			case 3:
				return data.ieltsScore || data.toeflScore; // At least one language test
			case 4:
				return (
					data.desiredCountries.length > 0 &&
					data.desiredDegree &&
					data.scholarshipAmount
				);
			case 5:
				return true;
			default:
				return false;
		}
	};

	return (
		<>
			<div className="min-h-screen bg-background py-8">
				<div className="container mx-auto max-w-4xl px-4">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold mb-2">{t("welcome")}</h1>
						<p className="text-muted-foreground">
							{t("setup_profile_message")}
						</p>
					</div>

					{cameFromRedirect ? (
						<div className="mb-6 rounded-lg border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm text-muted-foreground">
							{t("login_required_message", { destination: redirectTarget })}
						</div>
					) : null}

					{submissionError ? (
						<Alert variant="destructive" className="mb-6">
							<AlertTitle>Registration failed</AlertTitle>
							<AlertDescription>{submissionError}</AlertDescription>
						</Alert>
					) : null}

					<div className="mb-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<LogIn className="h-4 w-4" />
							<span>{t("already_have_account")}</span>
							<Button
								variant="link"
								className="px-1 font-semibold"
								onClick={() => {
									setLoginError(null);
									setLoginForm({ email: "", password: "" });
									setIsGoogleSigningIn(false);
									setIsLoginDialogOpen(true);
								}}
							>
								{t("login_cta")}
							</Button>
						</div>
					</div>

					<div className="mb-8">
						<div className="flex justify-between items-center mb-4">
							<span className="text-sm font-medium">
								{t("step", {
									currentStep: currentStep,
									totalSteps: steps.length,
								})}
							</span>
							<span className="text-sm text-muted-foreground">
								{t("complete", { progress: Math.round(progress) })}
							</span>
						</div>
						<Progress value={progress} className="h-2" />
					</div>

					<div className="flex justify-center mb-8">
						<div className="flex items-center space-x-4 overflow-x-auto pb-2">
							{steps.map((step, index) => (
								<div key={step.id} className="flex items-center">
									<div className="flex flex-col items-center min-w-0">
										<div
											className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
												step.id < currentStep
													? "bg-primary border-primary text-primary-foreground"
													: step.id === currentStep
														? "border-primary text-primary"
														: "border-muted-foreground/30 text-muted-foreground"
											}`}
										>
											{step.id < currentStep ? (
												<CheckCircle className="h-5 w-5" />
											) : (
												<span className="text-sm font-medium">{step.id}</span>
											)}
										</div>
										<div className="mt-2 text-center">
											<div className="text-sm font-medium">{step.title}</div>
											<div className="text-xs text-muted-foreground hidden sm:block">
												{step.description}
											</div>
										</div>
									</div>
									{index < steps.length - 1 && (
										<div className="w-12 h-px bg-muted-foreground/30 mx-4 mt-[-20px]" />
									)}
								</div>
							))}
						</div>
					</div>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle>{steps[currentStep - 1].title}</CardTitle>
							<CardDescription>
								{steps[currentStep - 1].description}
							</CardDescription>
						</CardHeader>
						<CardContent>{renderStep()}</CardContent>
					</Card>

					<div className="flex justify-between">
						<Button
							variant="outline"
							onClick={prevStep}
							disabled={currentStep === 1}
							className="flex items-center bg-transparent"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							{t("previous")}
						</Button>

						{currentStep === steps.length ? (
							<Button
								type="button"
								className="flex items-center"
								disabled={!isStepValid() || isSubmitting}
								onClick={handleComplete}
							>
								{isSubmitting ? "Creating account..." : t("complete_setup")}
								{!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
							</Button>
						) : (
							<Button
								type="button"
								onClick={nextStep}
								disabled={!isStepValid() || isSubmitting}
								className="flex items-center"
							>
								{t("next")}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			</div>

			<Dialog open={isLoginDialogOpen} onOpenChange={handleLoginDialogChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("login_dialog_title")}</DialogTitle>
						<DialogDescription>
							{t("login_dialog_description")}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleLoginSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="login-email">{t("login_form_email_label")}</Label>
							<Input
								id="login-email"
								type="email"
								value={loginForm.email}
								onChange={(event) =>
									updateLoginField("email")(event.target.value)
								}
								placeholder="you@example.com"
								autoComplete="email"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="login-password">
								{t("login_form_password_label")}
							</Label>
							<Input
								id="login-password"
								type="password"
								value={loginForm.password}
								onChange={(event) =>
									updateLoginField("password")(event.target.value)
								}
								placeholder="Enter your password"
								autoComplete="current-password"
								required
							/>
						</div>
						{loginError ? (
							<p className="text-sm text-destructive">{loginError}</p>
						) : null}
						<DialogFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<Button
								type="button"
								variant="ghost"
								className="w-full sm:w-auto sm:px-4"
								onClick={closeLoginDialog}
							>
								{t("login_cancel")}
							</Button>
							<div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-1 sm:gap-3">
								<Button
									type="submit"
									className="w-full sm:flex-1 sm:px-6"
									disabled={!isLoginValid || isGoogleSigningIn}
								>
									{t("login_submit")}
								</Button>
								<Button
									type="button"
									variant="outline"
									className="flex w-full items-center justify-center gap-2 sm:flex-1 sm:px-6"
									onClick={handleGoogleSignIn}
									disabled={isGoogleSigningIn}
								>
									<span className="font-semibold text-base leading-none">
										G
									</span>
									<span>
										{isGoogleSigningIn
											? t("login_google_loading")
											: t("login_google_cta")}
									</span>
								</Button>
							</div>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
