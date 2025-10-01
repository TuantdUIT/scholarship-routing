import type {
  ApplicationDetail,
  ApplicationSummary,
} from "../models/application";

export const mockApplicationSummaries: ApplicationSummary[] = [
  {
    id: "app1",
    scholarshipId: "s1",
    scholarshipTitle: "University of Oxford Graduate Scholarship",
    provider: "University of Oxford",
    country: "United Kingdom",
    amount: "Full tuition + £15,000 stipend",
    deadline: "2024-03-15",
    status: "in-progress",
    progress: 65,
    lastUpdated: "2024-01-15",
    documents: {
      required: ["CV", "Transcript", "Personal Statement", "Reference Letters"],
      uploaded: ["CV", "Transcript"],
      pending: ["Personal Statement", "Reference Letters"],
    },
    timeline: [
      { date: "2024-01-10", action: "Application started", type: "info" },
      { date: "2024-01-12", action: "CV uploaded", type: "success" },
      { date: "2024-01-15", action: "Transcript uploaded", type: "success" },
    ],
    reminders: [
      { date: "2024-02-01", message: "Personal Statement due in 2 weeks" },
      { date: "2024-02-15", message: "Reference letters due in 4 weeks" },
    ],
  },
  {
    id: "app2",
    scholarshipId: "s2",
    scholarshipTitle: "MIT Graduate Fellowship",
    provider: "Massachusetts Institute of Technology",
    country: "United States",
    amount: "Full tuition + $40,000 stipend",
    deadline: "2024-02-01",
    status: "submitted",
    progress: 100,
    lastUpdated: "2024-01-20",
    documents: {
      required: ["CV", "Transcript", "Research Proposal", "Reference Letters"],
      uploaded: ["CV", "Transcript", "Research Proposal", "Reference Letters"],
      pending: [],
    },
    timeline: [
      { date: "2024-01-05", action: "Application started", type: "info" },
      { date: "2024-01-10", action: "All documents uploaded", type: "success" },
      { date: "2024-01-20", action: "Application submitted", type: "success" },
    ],
    reminders: [],
  },
  {
    id: "app3",
    scholarshipId: "s3",
    scholarshipTitle: "DAAD Study Scholarship",
    provider: "German Academic Exchange Service",
    country: "Germany",
    amount: "€850/month + tuition coverage",
    deadline: "2024-04-30",
    status: "not-started",
    progress: 0,
    lastUpdated: "2024-01-08",
    documents: {
      required: ["CV", "Transcript", "Motivation Letter", "Language Certificate"],
      uploaded: [],
      pending: [
        "CV",
        "Transcript",
        "Motivation Letter",
        "Language Certificate",
      ],
    },
    timeline: [
      { date: "2024-01-08", action: "Added to applications", type: "info" },
    ],
    reminders: [
      { date: "2024-02-01", message: "Start preparing application documents" },
    ],
  },
  {
    id: "app4",
    scholarshipId: "s4",
    scholarshipTitle: "Cambridge Trust Scholarship",
    provider: "University of Cambridge",
    country: "United Kingdom",
    amount: "Full funding + living costs",
    deadline: "2024-01-31",
    status: "interview",
    progress: 90,
    lastUpdated: "2024-01-18",
    documents: {
      required: ["CV", "Transcript", "Research Proposal", "Reference Letters"],
      uploaded: ["CV", "Transcript", "Research Proposal", "Reference Letters"],
      pending: [],
    },
    timeline: [
      { date: "2024-01-01", action: "Application submitted", type: "success" },
      {
        date: "2024-01-18",
        action: "Interview invitation received",
        type: "success",
      },
    ],
    reminders: [
      { date: "2024-01-25", message: "Interview scheduled for January 30th" },
    ],
  },
  {
    id: "app5",
    scholarshipId: "s5",
    scholarshipTitle: "Fulbright Foreign Student Program",
    provider: "Fulbright Commission",
    country: "United States",
    amount: "Full funding + living stipend",
    deadline: "2024-05-15",
    status: "result",
    progress: 100,
    lastUpdated: "2024-01-10",
    documents: {
      required: ["CV", "Transcript", "Research Proposal", "Reference Letters"],
      uploaded: ["CV", "Transcript", "Research Proposal", "Reference Letters"],
      pending: [],
    },
    timeline: [
      { date: "2023-12-01", action: "Application submitted", type: "success" },
      {
        date: "2024-01-10",
        action: "Awaiting final decision",
        type: "info",
      },
    ],
    reminders: [
      { date: "2024-02-10", message: "Follow up with program coordinator" },
    ],
  },
];

export const mockApplicationDetailMap: Partial<Record<string, ApplicationDetail>> = {
  app1: {
    id: "app1",
    scholarshipId: "s1",
    scholarshipTitle: "University of Oxford Graduate Scholarship",
    provider: "University of Oxford",
    country: "United Kingdom",
    amount: "Full tuition + £15,000 stipend",
    deadline: "2024-03-15",
    status: "in-progress",
    progress: 65,
    lastUpdated: "2024-01-15",
    documents: {
      required: [
        {
          name: "CV/Resume",
          status: "uploaded",
          uploadDate: "2024-01-12",
          fileSize: "245 KB",
          fileName: "John_Doe_CV.pdf",
        },
        {
          name: "Academic Transcripts",
          status: "uploaded",
          uploadDate: "2024-01-15",
          fileSize: "1.2 MB",
          fileName: "Transcripts_Official.pdf",
        },
        {
          name: "Personal Statement",
          status: "pending",
          uploadDate: null,
          fileSize: null,
          fileName: null,
        },
        {
          name: "Reference Letters",
          status: "pending",
          uploadDate: null,
          fileSize: null,
          fileName: null,
        },
      ],
    },
    timeline: [
      {
        date: "2024-01-10",
        action: "Application started",
        type: "info",
        description: "Added scholarship to applications list",
      },
      {
        date: "2024-01-12",
        action: "CV uploaded",
        type: "success",
        description: "Successfully uploaded CV document",
      },
      {
        date: "2024-01-15",
        action: "Transcript uploaded",
        type: "success",
        description: "Official transcripts uploaded and verified",
      },
    ],
    reminders: [
      {
        id: "r1",
        date: "2024-02-01",
        message: "Personal Statement due in 2 weeks",
        type: "deadline",
        isActive: true,
      },
      {
        id: "r2",
        date: "2024-02-15",
        message: "Reference letters due in 4 weeks",
        type: "deadline",
        isActive: true,
      },
    ],
    notes:
      "Focus on research experience in personal statement. Contact Prof. Smith for reference letter.",
    applicationUrl: "https://oxford.edu/apply/12345",
  },
};
