"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { ThemeToggle } from "@/core/components/ui/themeToggle";
import { useAuth } from "@/core/providers/auth-provider";
import {
  Bell,
  Calendar,
  FileText,
  Globe,
  GraduationCap,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const buildNavigationItems = (t: ReturnType<typeof useTranslations>) => [
  { href: "/scholarships", label: t("header.scholarships"), icon: Search },
  { href: "/applications", label: t("header.my_applications"), icon: FileText },
  { href: "/calendar", label: t("header.deadlines"), icon: Calendar },
  { href: "/profile", label: t("header.profile"), icon: User },
];

export function Header() {
  const t = useTranslations();
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = useMemo(() => buildNavigationItems(t), [t]);

  const isRoutePublic = (href: string) => href.startsWith("/scholarships") || href === "/";

  const getNavigationHref = (href: string) => {
    if (isRoutePublic(href)) {
      return href;
    }
    return isAuthenticated ? href : `/onboarding?redirect=${encodeURIComponent(href)}`;
  };

  const loginHref = "/onboarding?mode=login";
  const registerHref = "/onboarding";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    router.push("/");
  };


  const userInitials = user?.name
    ?.split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SR";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">ScholarshipRouting</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={getNavigationHref(item.href)}
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Globe className="h-4 w-4" />
                {t("header.vietnamese")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("header.vietnamese")}</DropdownMenuItem>
              <DropdownMenuItem>{t("header.english")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px]" variant="destructive">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>{t("header.notifications")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium">{t("header.new_scholarship")}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("header.new_scholarship_description")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium">{t("header.application_update")}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("header.application_update_description")}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name ?? "User"} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">
                      {user?.name ?? t("header.user_name")}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name ?? t("header.user_name")}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email ?? t("header.user_email")}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getNavigationHref("/profile")} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("header.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("header.settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async (event) => {
                      event.preventDefault();
                      await handleLogout();
                    }}
                  >
                    {t("header.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href={loginHref}>{t("header.login")}</Link>
              </Button>
              <Button asChild>
                <Link href={registerHref}>{t("header.get_started")}</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen ? (
        <div className="md:hidden border-t bg-background shadow-sm">
          <nav className="container px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={getNavigationHref(item.href)}
                className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={closeMobileMenu}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild variant="outline" onClick={closeMobileMenu}>
                  <Link href={loginHref}>{t("header.login")}</Link>
                </Button>
                <Button asChild onClick={closeMobileMenu}>
                  <Link href={registerHref}>{t("header.get_started")}</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}


