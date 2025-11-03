"use client";

import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Progress } from "@/core/components/ui/progress";
import { Separator } from "@/core/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/core/components/ui/sheet";
import { ScholarshipCard } from "@/modules/scholarships/components/scholarship-card";
import { ScholarshipFilters } from "@/modules/scholarships/components/scholarship-filters";
import { ScholarshipSort } from "@/modules/scholarships/components/scholarship-sort";
import { Filter, Search, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { ScholarshipApi, UIScholarship } from "@/core/services/scholarship-api";
import { useToast } from "@/core/hooks/use-toast";

interface ScholarFilter {
	countries: string[];
	degreeLevel: string;
	minAmount: string;
	maxGpa: string;
	minIelts: string;
	fields: string[];
	deadlineRange: string;
	onlyPassed: boolean;
}

export default function ScholarshipsPage() {
	const t = useTranslations("scholarships_page");
	const { toast } = useToast();
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [sortBy, setSortBy] = useState("match-score");
	const [scholarships, setScholarships] = useState<UIScholarship[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [total, setTotal] = useState(0);
	const [offset, setOffset] = useState(0);
	const [filters, setFilters] = useState<ScholarFilter>({
		countries: [],
		degreeLevel: "",
		minAmount: "",
		maxGpa: "",
		minIelts: "",
		fields: [],
		deadlineRange: "",
		onlyPassed: false,
	});

	const PAGE_SIZE = 10;

	// Load initial scholarships
	const loadScholarships = useCallback(
		async (resetOffset = false) => {
			try {
				setLoading(resetOffset);
				const currentOffset = resetOffset ? 0 : offset;

				let response;
				if (searchQuery.trim()) {
					// Use search API when there's a search query
					response = await ScholarshipApi.searchScholarships({
						q: searchQuery.trim(),
						size: PAGE_SIZE,
						offset: currentOffset,
						collection: "scholarships_en",
					});
				} else {
					// Use filter API for default view (latest scholarships)
					response = await ScholarshipApi.getLatestScholarships(
						PAGE_SIZE,
						currentOffset,
					);
				}

				const transformedData = ScholarshipApi.transformResponseToUI(response);

				if (resetOffset) {
					setScholarships(transformedData.scholarships);
					setOffset(PAGE_SIZE);
				} else {
					setScholarships((prev) => [...prev, ...transformedData.scholarships]);
					setOffset((prev) => prev + PAGE_SIZE);
				}

				setTotal(transformedData.total);
				setHasMore(
					transformedData.scholarships.length === PAGE_SIZE &&
					currentOffset + PAGE_SIZE < transformedData.total,
				);
			} catch (error) {
				console.error("Error loading scholarships:", error);
				toast({
					variant: "destructive",
					title: "Lỗi tải dữ liệu",
					description: "Không thể tải danh sách học bổng. Vui lòng thử lại.",
				});
			} finally {
				setLoading(false);
				setLoadingMore(false);
			}
		},
		[searchQuery, offset, toast],
	);

	// Load more scholarships
	const loadMoreScholarships = async () => {
		if (loadingMore || !hasMore) return;
		setLoadingMore(true);
		await loadScholarships(false);
	};

	// Search with debounce
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOffset(0);
			loadScholarships(true);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchQuery]);

	// Initial load
	useEffect(() => {
		loadScholarships(true);
	}, []);

	// Apply client-side filters and sorting
	const filteredScholarships = scholarships.filter((scholarship) => {
		// Apply filters here (client-side filtering on already loaded data)
		if (filters.onlyPassed && !scholarship.hardConditionsPassed) return false;
		if (filters.degreeLevel && scholarship.degreeLevel !== filters.degreeLevel)
			return false;
		if (
			filters.countries.length > 0 &&
			!filters.countries.includes(scholarship.country)
		)
			return false;

		return true;
	});

	const sortedScholarships = [...filteredScholarships].sort((a, b) => {
		switch (sortBy) {
			case "match-score":
				return b.matchScore - a.matchScore;
			case "deadline":
				return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
			case "amount":
				return b.title.localeCompare(a.title); // Simplified sorting
			default:
				return 0;
		}
	});

	const passedCount = filteredScholarships.filter(
		(s) => s.hardConditionsPassed,
	).length;
	const totalCount = filteredScholarships.length;

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-7xl px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl md:text-3xl font-bold mb-2">{t("title")}</h1>
					<p className="text-muted-foreground text-sm md:text-base">
						{t("description")}
					</p>
				</div>

				{/* Search and Controls */}
				<Card className="mb-6">
					<CardContent className="p-4 md:p-6">
						<div className="space-y-4">
							{/* Search Bar */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder={t("search_placeholder")}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 min-h-[44px]"
								/>
							</div>

							{/* Controls */}
							<div className="flex flex-col sm:flex-row gap-2">
								<div className="block lg:hidden">
									<Sheet>
										<SheetTrigger asChild>
											<Button
												variant="outline"
												className="w-full min-h-[44px] bg-transparent"
											>
												<Filter className="mr-2 h-4 w-4" />
												{t("filters")}
											</Button>
										</SheetTrigger>
										<SheetContent side="left" className="w-full sm:w-80">
											<SheetHeader>
												<SheetTitle>{t("filter_scholarships")}</SheetTitle>
											</SheetHeader>
											<div className="mt-6">
												<ScholarshipFilters
													filters={filters}
													onFiltersChange={setFilters}
												/>
											</div>
										</SheetContent>
									</Sheet>
								</div>

								<div className="hidden lg:block">
									<Button
										variant={showFilters ? "default" : "outline"}
										onClick={() => setShowFilters(!showFilters)}
										className="min-h-[44px]"
									>
										<Filter className="mr-2 h-4 w-4" />
										{t("filters")}
									</Button>
								</div>

								<div className="flex-1 sm:flex-none">
									<ScholarshipSort sortBy={sortBy} onSortChange={setSortBy} />
								</div>
							</div>

							{/* Results Summary */}
							{!loading && (
								<div className="space-y-4">
									<div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
										<div className="flex flex-wrap items-center gap-2 sm:gap-4">
											<span className="text-gray-700 font-bold">
												{t("scholarships_found", { totalCount: total })}
											</span>
											<Separator
												orientation="vertical"
												className="h-4 hidden sm:block"
											/>
											{/* <span className="text-green-600">
												{t("match_your_profile", { passedCount: passedCount })}
											</span> */}
											<Separator
												orientation="vertical"
												className="h-4 hidden sm:block"
											/>
											{/* <span>
												{t("need_improvement", {
													improvementCount: totalCount - passedCount,
												})}
											</span> */}
										</div>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-6">
					{showFilters && (
						<div className="hidden lg:block w-80 flex-shrink-0">
							<ScholarshipFilters
								filters={filters}
								onFiltersChange={setFilters}
							/>
						</div>
					)}

					{/* Results */}
					<div className="flex-1 min-w-0">
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<Loader2 className="h-8 w-8 animate-spin" />
								<span className="ml-2">Đang tải học bổng...</span>
							</div>
						) : sortedScholarships.length === 0 ? (
							<Card className="text-center py-12">
								<CardContent>
									<Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
									<h3 className="text-lg font-semibold mb-2">
										{t("no_scholarships_found")}
									</h3>
									<p className="text-muted-foreground mb-4 text-sm md:text-base">
										{t("no_scholarships_found_description")}
									</p>
									<Button
										variant="outline"
										className="min-h-[44px] bg-transparent"
										onClick={() => {
											setSearchQuery("");
											setFilters({
												countries: [],
												degreeLevel: "",
												minAmount: "",
												maxGpa: "",
												minIelts: "",
												fields: [],
												deadlineRange: "",
												onlyPassed: false,
											});
										}}
									>
										{t("clear_all_filters")}
									</Button>
								</CardContent>
							</Card>
						) : (
							<div className="space-y-4">
								{sortedScholarships.map((scholarship) => (
									<ScholarshipCard
										key={scholarship.id}
										scholarship={scholarship}
									/>
								))}

								{/* Show More Button */}
								{hasMore && (
									<div className="flex justify-center pt-4">
										<Button
											onClick={loadMoreScholarships}
											disabled={loadingMore}
											variant="outline"
											className="min-h-[44px] bg-transparent"
										>
											{loadingMore ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Đang tải...
												</>
											) : (
												"Xem thêm"
											)}
										</Button>
									</div>
								)}

								{/* End of results indicator */}
								{!hasMore && scholarships.length > 0 && (
									<div className="text-center py-4 text-sm text-muted-foreground">
										Đã hiển thị tất cả {total} học bổng
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
