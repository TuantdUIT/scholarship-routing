import { Header } from "@/core/components/layout/header";
import { AuthProvider } from "@/core/providers/auth-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import type React from "react";
import { Suspense } from "react";
import "./globals.css";
import { notFound } from "next/navigation";
import { routing } from "@/core/i18n/routing";

const beVietnamPro = Be_Vietnam_Pro({
	subsets: ["latin", "vietnamese"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "ScholarSearch - Graduate Study Abroad Scholarship Platform",
	description:
		"Find and apply for graduate study abroad scholarships with AI-powered matching and application assistance",
	generator: "v0.app",
};

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};
export default async function RootLayout({ children, params }: Props) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	return (
		<html lang={locale}>
			<body className={beVietnamPro.className}>
				<AuthProvider>
					<NextIntlClientProvider>
						<div className="min-h-screen bg-background">
							<Suspense fallback={<div>Loading...</div>}>
								<Header />
								<main className="flex-1">{children}</main>
							</Suspense>
						</div>
						<Analytics />
					</NextIntlClientProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
