import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/card";
import {
	ArrowRight,
	Calendar,
	CheckCircle,
	FileText,
	Globe,
	Search,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HomePage() {
	const t = useTranslations("home");

	const features = [
		{
			icon: Search,
			title: t("feature_1_title"),
			description: t("feature_1_description"),
			color: "text-blue-600",
		},
		{
			icon: Target,
			title: t("feature_2_title"),
			description: t("feature_2_description"),
			color: "text-green-600",
		},
		{
			icon: Calendar,
			title: t("feature_3_title"),
			description: t("feature_3_description"),
			color: "text-orange-600",
		},
		{
			icon: FileText,
			title: t("feature_4_title"),
			description: t("feature_4_description"),
			color: "text-purple-600",
		},
	];

	const stats = [
		{ label: t("active_scholarships"), value: "2,500+", icon: Globe },
		{ label: t("success_rate"), value: "78%", icon: TrendingUp },
		{ label: t("students_helped"), value: "15,000+", icon: Users },
		{ label: t("countries_covered"), value: "45+", icon: CheckCircle },
	];

	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative py-20 px-4 bg-background">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center space-y-6">
						<Badge variant="secondary" className="mb-4">
							🎓 {t("badge")}
						</Badge>
						<h1 className="text-4xl md:text-6xl font-bold text-balance">
							{t("title")}
							<span className="text-accent"> {t("title_highlight")}</span>
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
							{t("description")}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
							<Button size="lg" asChild>
								<Link href="/onboarding">
									{t("get_started")}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<Link href="/scholarships">{t("browse_scholarships")}</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 px-4 bg-card">
				<div className="container mx-auto max-w-6xl">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((stat) => (
							<div key={stat.label} className="text-center">
								<div className="flex justify-center mb-2">
									<stat.icon className="h-8 w-8 text-accent" />
								</div>
								<div className="text-3xl font-bold text-foreground">
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							{t("features_title")}
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							{t("features_description")}
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{features.map((feature) => (
							<Card
								key={feature.title}
								className="text-center hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex justify-center mb-4">
										<div className="p-3 rounded-lg bg-muted">
											<feature.icon className={`h-6 w-6 ${feature.color}`} />
										</div>
									</div>
									<CardTitle className="text-lg">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{feature.description}</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 bg-primary text-primary-foreground">
				<div className="container mx-auto max-w-4xl text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						{t("cta_title")}
					</h2>
					<p className="text-xl mb-8 opacity-90">{t("cta_description")}</p>
					<Button size="lg" variant="secondary" asChild>
						<Link href="/onboarding">
							{t("create_profile")}
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
			</section>
		</div>
	);
}
