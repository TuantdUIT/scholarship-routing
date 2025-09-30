"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface ScholarshipSortProps {
	sortBy: string;
	onSortChange: (sortBy: string) => void;
}

export function ScholarshipSort({
	sortBy,
	onSortChange,
}: ScholarshipSortProps) {
	const t = useTranslations("scholarship");

	return (
		<Select value={sortBy} onValueChange={onSortChange}>
			<SelectTrigger className="w-48">
				<ArrowUpDown className="mr-2 h-4 w-4" />
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="match-score">{t("best_match")}</SelectItem>
				<SelectItem value="deadline">{t("deadline_soonest")}</SelectItem>
				<SelectItem value="amount">{t("scholarship_amount")}</SelectItem>
				<SelectItem value="alphabetical">{t("alphabetical")}</SelectItem>
			</SelectContent>
		</Select>
	);
}
