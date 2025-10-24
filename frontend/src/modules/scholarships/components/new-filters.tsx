import React, { useState } from "react";

// --- Định nghĩa kiểu dữ liệu cho các bộ lọc ---
interface FiltersState {
	scholarshipType: string;
	country: string[];
	fundingLevel: string;

	applicationMode: string;
	applicationMonth: number[];
	eligibility: string;
	eligibleFields: string[];
	minGpa: string;
	languageCertificate: Record<string, string>; // Thay đổi: Cho phép nhiều chứng chỉ
}

// --- Dữ liệu cho các tùy chọn bộ lọc ---
const filterOptions = {
	scholarshipType: ["Quỹ, tổ chức", "Chính phủ", "Trường"],
	country: [
		"United States",
		"United Kingdom",
		"Canada",
		"Australia",
		"Germany",
		"Netherlands",
		"Sweden",
		"Norway",
		"Denmark",
		"Switzerland",
		"France",
		"Japan",
		"South Korea",
		"Singapore",
		"Other",
	],
	fundingLevel: ["Toàn phần", "Bán phần", "Học bổng trao đổi"],
	applicationMode: ["Thường niên", "Không thường niên"],
	applicationMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	eligibility: ["Có", "Không"],
	eligibleFields: [
		"Computer Scien",
		"Data Science",
		"Engineering",
		"Business Admin",
		"Economics",
		"Medicine",
		"Law",
		"Psychology",
		"Biology",
		"Chemistry",
		"Physics",
		"Mathematics",
		"Other",
	],
	minGpa: ["3.6 - 4.0", "3.2 - 3.59", "2.5 - 3.19", "2.0 - 2.49"],
	languageCertificate: ["IELTS", "TOEIC", "TOEFL", "SAT", "GMAT"],
};

// --- Component Icon (SVG nội tuyến) ---
const FilterIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="w-5 h-5"
	>
		<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
	</svg>
);

const CheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="3"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="mr-1"
	>
		<polyline points="20 6 9 17 4 12"></polyline>
	</svg>
);

// --- Component chính cho bộ lọc ---
const ScholarshipFilter = () => {
	const initialState: FiltersState = {
		scholarshipType: "",
		country: [],
		fundingLevel: "",
		applicationMode: "",
		applicationMonth: [],
		eligibility: "",
		eligibleFields: [],
		minGpa: "",
		languageCertificate: {}, // Thay đổi: Khởi tạo là object rỗng
	};

	const [filters, setFilters] = useState<FiltersState>(initialState);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	// --- Hàm xử lý khi chọn/bỏ chọn một tùy chọn ---
	const handleSelect = (
		category: keyof FiltersState,
		value: string | number,
		isMultiSelect: boolean = false,
	) => {
		setFilters((prev) => {
			const currentSelection = prev[category];

			if (isMultiSelect && Array.isArray(currentSelection)) {
				const newSelection = currentSelection.includes(value as never)
					? currentSelection.filter((item) => item !== value)
					: [...currentSelection, value as never];
				return { ...prev, [category]: newSelection };
			}

			const newSelection = currentSelection === value ? "" : value;
			return { ...prev, [category]: newSelection };
		});
	};

	// --- Các hàm xử lý mới cho chứng chỉ ngôn ngữ ---
	const handleLanguageCertToggle = (certType: string) => {
		setFilters((prev) => {
			const newCerts = { ...prev.languageCertificate };
			if (newCerts.hasOwnProperty(certType)) {
				delete newCerts[certType]; // Bỏ chọn: xóa key
			} else {
				newCerts[certType] = ""; // Chọn: thêm key với điểm rỗng
			}
			return { ...prev, languageCertificate: newCerts };
		});
	};

	const handleLanguageScoreChange = (certType: string, score: string) => {
		setFilters((prev) => ({
			...prev,
			languageCertificate: {
				...prev.languageCertificate,
				[certType]: score,
			},
		}));
	};

	// --- Hàm render các tùy chọn cho mỗi trường ---
	const renderOptions = (
		category: keyof Omit<FiltersState, "languageCertificate">,
		options: (string | number)[],
		isMultiSelect: boolean = false,
	) => (
		<div className="mb-6">
			<h3 className="font-semibold text-gray-800 mb-3 capitalize">
				{category.replace(/([A-Z])/g, " $1")}
			</h3>
			<div className="flex flex-wrap gap-3">
				{options.map((option) => {
					const isSelected = isMultiSelect
						? (filters[category] as (string | number)[]).includes(option)
						: filters[category] === option;

					return (
						<button
							key={option}
							onClick={() => handleSelect(category, option, isMultiSelect)}
							className={`flex items-center justify-center px-4 py-2 border rounded-lg text-sm transition-all duration-200 ${
								isSelected
									? "border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-sm"
									: "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
							}`}
						>
							{isSelected && <CheckIcon />}
							{option}
						</button>
					);
				})}
			</div>
		</div>
	);

	return (
		<div className="p-4">
			{/* Nút Lọc chính để mở Modal */}
			<button
				onClick={() => setIsFilterOpen(true)}
				className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-600 border border-blue-500 rounded-lg shadow-sm hover:bg-blue-50 transition-all font-semibold"
			>
				<FilterIcon />
				<span>Lọc</span>
			</button>

			{/* Modal bộ lọc */}
			{isFilterOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-start p-4"
					onClick={() => setIsFilterOpen(false)} // Đóng modal khi click vào nền
				>
					<div
						className="relative max-w-5xl w-full bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col"
						onClick={(e) => e.stopPropagation()} // Ngăn việc đóng modal khi click vào nội dung
					>
						{/* Header của Modal */}
						<div className="flex justify-between items-center border-b p-4 sm:p-6 sticky top-0 bg-white z-10">
							<div className="flex items-center gap-3">
								<FilterIcon />
								<h2 className="text-xl font-bold text-gray-800">
									Bộ lọc tìm kiếm học bổng
								</h2>
							</div>
							<button
								onClick={() => setIsFilterOpen(false)}
								className="text-gray-500 hover:text-gray-800 text-3xl leading-none transition-colors"
							>
								&times;
							</button>
						</div>

						{/* Nội dung có thể cuộn */}
						<div className="overflow-y-auto p-4 sm:p-6">
							{renderOptions("scholarshipType", filterOptions.scholarshipType)}
							{renderOptions("country", filterOptions.country, true)}
							{renderOptions("fundingLevel", filterOptions.fundingLevel)}
							{renderOptions("applicationMode", filterOptions.applicationMode)}
							{renderOptions(
								"applicationMonth",
								filterOptions.applicationMonth,
								true,
							)}
							{renderOptions("eligibility", filterOptions.eligibility)}
							{renderOptions(
								"eligibleFields",
								filterOptions.eligibleFields,
								true,
							)}
							{renderOptions("minGpa", filterOptions.minGpa)}

							{/* Trường đặc biệt: Language Certificate */}
							<div className="mb-6">
								<h3 className="font-semibold text-gray-800 mb-3">
									Language Certificate
								</h3>
								<div className="flex flex-col items-start gap-4">
									{filterOptions.languageCertificate.map((option) => {
										const isSelected =
											filters.languageCertificate.hasOwnProperty(option);
										return (
											<div
												key={option}
												className="flex items-center gap-4 w-full"
												style={{ maxWidth: "450px" }}
											>
												<button
													onClick={() => handleLanguageCertToggle(option)}
													className={`w-48 flex-shrink-0 flex items-center justify-start p-3 border rounded-lg text-sm transition-all duration-200 ${
														isSelected
															? "border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-sm"
															: "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
													}`}
												>
													{isSelected ? (
														<CheckIcon />
													) : (
														<span className="w-4 mr-1"></span>
													)}
													<span className="ml-2">{option}</span>
												</button>

												<div className="relative flex-grow h-12">
													{isSelected && (
														<input
															type="number"
															placeholder={`Nhập điểm ${option}`}
															value={filters.languageCertificate[option]}
															onChange={(e) =>
																handleLanguageScoreChange(
																	option,
																	e.target.value,
																)
															}
															className="border-gray-300 rounded-lg p-3 text-sm w-full h-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
														/>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>

						{/* Nút actions ở footer */}
						<div className="flex justify-end gap-4 p-4 sm:p-6 border-t mt-auto sticky bottom-0 bg-white z-10">
							<button
								onClick={() => setFilters(initialState)}
								className="px-6 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
							>
								Bỏ chọn
							</button>
							<button
								onClick={() => setIsFilterOpen(false)}
								className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow"
							>
								Xem kết quả
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ScholarshipFilter;
