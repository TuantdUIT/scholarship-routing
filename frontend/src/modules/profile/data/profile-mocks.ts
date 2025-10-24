import type {
	DocumentRequirement,
	ExperienceEntry,
	ParsedCVField,
	PersonalInfo,
	ProfileDocument,
	TestScore,
	UserProfileSummary,
	EducationEntry,
	ActivityEntry,
	PublicationEntry,
} from "./profile-types";

export const mockUserProfile: UserProfileSummary = {
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
};

export const personalInfoDefaults: PersonalInfo = {
	name: "John Doe",
	email: "john.doe@example.com",
	phone: "+84 123 456 789",
	nationality: "Vietnam",
	currentLevel: "Master's Degree",
	dateOfBirth: "1995-06-15",
	address: "Ho Chi Minh City, Vietnam",
	bio: "Computer Science graduate student passionate about AI and machine learning research.",
};

export const profileCountries = [
	"Vietnam",
	"Thailand",
	"Singapore",
	"Malaysia",
	"Indonesia",
	"Philippines",
	"India",
	"China",
	"South Korea",
	"Japan",
	"Other",
];

export const profileCurrentLevels = [
	"Bachelor's Degree",
	"Master's Degree",
	"PhD",
	"Professional Degree",
];

export const educationGpaScales = ["4.0", "10.0", "100"];

export const educationDegreeTypes = [
	"Bachelor's",
	"Master's",
	"PhD",
	"Professional",
	"Diploma",
	"Certificate",
];

export const educationEntries: EducationEntry[] = [
	{
		id: "1",
		institution: "University of Technology",
		degree: "Bachelor's",
		major: "Computer Science",
		gpa: "3.4",
		gpaScale: "4.0",
		startDate: "2018-09",
		endDate: "2022-06",
		status: "completed",
	},
	{
		id: "2",
		institution: "National University",
		degree: "Master's",
		major: "Data Science",
		gpa: "3.7",
		gpaScale: "4.0",
		startDate: "2022-09",
		endDate: "2024-06",
		status: "in-progress",
	},
];

export const profileTestScores: TestScore[] = [
	{
		type: "IELTS",
		score: "7.0",
		maxScore: 9,
		date: "2023-08-15",
		status: "valid",
	},
	{
		type: "TOEFL iBT",
		score: "",
		maxScore: 120,
		date: "",
		status: "pending",
	},
	{
		type: "GRE",
		score: "320",
		maxScore: 340,
		date: "2023-06-20",
		status: "valid",
	},
	{
		type: "GMAT",
		score: "",
		maxScore: 800,
		date: "",
		status: "pending",
	},
];

export const activityEntries: ActivityEntry[] = [
	{
		id: "1",
		title: "Volunteer Teaching Program",
		organization: "Local Community Center",
		role: "Math Tutor",
		type: "volunteer",
		startDate: "2022-09",
		endDate: "2023-06",
		current: false,
		description:
			"Provided free math tutoring to underprivileged high school students, helping improve their academic performance and college readiness.",
		achievements: [
			"Tutored 25+ students",
			"Improved average test scores by 30%",
			"Organized study groups",
		],
	},
	{
		id: "2",
		title: "Student Government Association",
		organization: "University",
		role: "Vice President",
		type: "leadership",
		startDate: "2023-01",
		endDate: "",
		current: true,
		description:
			"Leading student initiatives and representing student interests in university policy discussions.",
		achievements: [
			"Led 3 major campus initiatives",
			"Increased student engagement by 40%",
		],
	},
];

export const experienceEntries: ExperienceEntry[] = [
	{
		id: "1",
		role: "Machine Learning Intern",
		company: "Tech Startup Inc.",
		type: "internship",
		startDate: "2023-06",
		endDate: "2023-08",
		current: false,
		description:
			"Developed ML models for customer behavior prediction using Python and TensorFlow. Improved model accuracy by 15% through feature engineering and hyperparameter tuning.",
		skills: ["Python", "TensorFlow", "Machine Learning", "Data Analysis"],
	},
	{
		id: "2",
		role: "Research Assistant",
		company: "University AI Lab",
		type: "research",
		startDate: "2023-01",
		endDate: "",
		current: true,
		description:
			"Conducting research on natural language processing and deep learning. Published 2 papers in international conferences.",
		skills: ["NLP", "Deep Learning", "PyTorch", "Research"],
	},
];

export const publicationEntries: PublicationEntry[] = [
	{
		id: "1",
		title:
			"Deep Learning Approaches for Natural Language Processing in Educational Applications",
		authors: "John Doe, Jane Smith, Prof. Wilson",
		journal: "International Conference on AI in Education",
		year: "2023",
		type: "conference",
		status: "published",
		doi: "10.1000/182",
		abstract:
			"This paper presents novel deep learning approaches for natural language processing specifically designed for educational applications...",
		url: "https://example.com/paper1",
	},
	{
		id: "2",
		title: "Machine Learning Models for Student Performance Prediction",
		authors: "John Doe, Dr. Brown",
		journal: "Journal of Educational Technology",
		year: "2024",
		type: "journal",
		status: "under-review",
		doi: "",
		abstract:
			"We propose a comprehensive framework for predicting student performance using various machine learning techniques...",
		url: "",
	},
];

export const profileDocumentTypes: DocumentRequirement[] = [
	{ value: "cv", label: "CV/Resume", required: true },
	{ value: "transcript", label: "Academic Transcript", required: true },
	{ value: "sop", label: "Statement of Purpose", required: false },
	{ value: "recommendation", label: "Recommendation Letter", required: false },
	{ value: "certificate", label: "Certificate", required: false },
	{ value: "portfolio", label: "Portfolio", required: false },
	{ value: "other", label: "Other", required: false },
];

export const profileDocuments: ProfileDocument[] = [
	{
		id: "1",
		name: "John_Doe_CV_2024.pdf",
		type: "cv",
		status: "verified",
		uploadDate: "2024-01-15",
		size: "2.3 MB",
		url: "#",
	},
	{
		id: "2",
		name: "Official_Transcript.pdf",
		type: "transcript",
		status: "verified",
		uploadDate: "2024-01-10",
		size: "1.8 MB",
		url: "#",
	},
	{
		id: "3",
		name: "Statement_of_Purpose.docx",
		type: "sop",
		status: "processing",
		uploadDate: "2024-01-20",
		size: "0.5 MB",
	},
];

export const parsedCVFields: ParsedCVField[] = [
	{ field: "Name", value: "John Doe", confidence: 95 },
	{ field: "Email", value: "john.doe@example.com", confidence: 98 },
	{ field: "Phone", value: "+84 123 456 789", confidence: 90 },
	{
		field: "Education",
		value: "Master's in Computer Science",
		confidence: 92,
	},
	{
		field: "Experience",
		value: "3 years software development",
		confidence: 88,
	},
	{
		field: "Skills",
		value: "Python, JavaScript, Machine Learning",
		confidence: 85,
	},
];
