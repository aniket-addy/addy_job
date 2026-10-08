export interface JobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  workplace: string;
  salary: string;
  posted: string;
  category: string;
  tags: string[];
  aboutCompany: string;
  companySize: string;
  founded: string;
  industry: string;
  website: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  experience?: string;
  openings?: number | string;
  applicants?: string;
  postedBy?: string;
  benefits: string[];
}

export const jobsList: JobDetail[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer (React/Next.js)",
    company: "NovaTech Solutions",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    workplace: "Remote",
    salary: "₹18L - ₹24L/yr",
    posted: "1 day ago",
    category: "Engineering",
    tags: ["React", "TypeScript", "Next.js", "Tailwind"],
    aboutCompany:
      "NovaTech Solutions is an enterprise cloud computing company building high-scale developer platforms and SaaS infrastructures trusted by Fortune 500 teams.",
    companySize: "1,200+ employees",
    founded: "2018",
    industry: "Enterprise Cloud & Software",
    website: "novatech-solutions.io",
    description:
      "We are looking for an experienced Senior Frontend Engineer to architect and build our next-generation cloud dashboard. You will work closely with product and design teams to create snappy, accessible, and high-performance interfaces using React, Next.js, and TypeScript.",
    responsibilities: [
      "Architect and ship modern, performant web applications using Next.js and TypeScript.",
      "Collaborate with UX designers to translate complex cloud telemetry into elegant dashboards.",
      "Optimize frontend asset loading, runtime performance, and core web vitals.",
      "Mentor junior frontend developers and uphold clean code, CI/CD, and testing standards.",
    ],
    requirements: [
      "4+ years of professional experience with React, Next.js, and TypeScript.",
      "Deep understanding of server components, state management, and modern CSS frameworks.",
      "Familiarity with REST and GraphQL APIs, WebSockets, and performance profiling.",
      "Strong communication and autonomous problem-solving capabilities.",
    ],
    benefits: [
      "100% Remote flexibility with home-office setup allowance",
      "Competitive stock options (ESOPs) & annual bonuses",
      "Comprehensive medical insurance for employee and dependents",
      "₹1,00,000 annual learning & certification budget",
    ],
  },
  {
    id: "2",
    title: "Lead Product Designer (UI/UX)",
    company: "BrightPath Digital",
    location: "Mohali, Punjab",
    type: "Full-time",
    workplace: "Hybrid",
    salary: "₹14L - ₹18L/yr",
    posted: "2 days ago",
    category: "Design",
    tags: ["Figma", "Design Systems", "Prototyping"],
    aboutCompany:
      "BrightPath Digital is an award-winning human-centered digital studio specializing in design systems, mobile apps, and enterprise web experiences.",
    companySize: "450+ employees",
    founded: "2019",
    industry: "Digital Design & Product Studio",
    website: "brightpathdigital.com",
    description:
      "As Lead Product Designer, you will shape the future visual language and user experience across our flagship fintech and healthcare client applications. You'll lead design systems and guide product discovery workshops.",
    responsibilities: [
      "Lead end-to-end product design from user discovery to interactive prototypes.",
      "Maintain and scale our centralized Figma multi-brand design tokens system.",
      "Conduct user testing sessions, synthesize feedback, and iterate rapidly.",
      "Partner with product managers and engineers to ensure high-fidelity implementation.",
    ],
    requirements: [
      "4+ years of experience in product design, UI/UX, or digital product studios.",
      "Mastery of Figma, micro-animations, user testing, and interactive prototyping.",
      "Demonstrated portfolio showcasing shipped complex web or mobile products.",
      "Empathy for user problems and strong presentation skills.",
    ],
    benefits: [
      "Flexible hybrid working schedule (2 days in-office)",
      "Top-tier MacBook Pro and ergonomic workspace",
      "Health & wellness subsidies and gym memberships",
      "Generous paid time off and mental health days",
    ],
  },
  {
    id: "3",
    title: "Backend Specialist (Node.js & Go)",
    company: "Skyline Technologies",
    location: "Hyderabad, Telangana",
    type: "Full-time",
    workplace: "Remote",
    salary: "₹20L - ₹28L/yr",
    posted: "Just now",
    category: "Engineering",
    tags: ["Node.js", "PostgreSQL", "Go", "Docker"],
    aboutCompany:
      "Skyline Technologies is a fintech powerhouse facilitating real-time transactions, payment infrastructure, and banking APIs handling millions of requests daily.",
    companySize: "2,500+ employees",
    founded: "2016",
    industry: "Fintech & Banking Infrastructure",
    website: "skyline-tech.com",
    description:
      "We are seeking a Backend Specialist who thrives in high-concurrency distributed systems. You will build microservices that handle high-volume financial traffic with low latency and bank-grade fault tolerance.",
    responsibilities: [
      "Design resilient backend microservices using Node.js, Go, and PostgreSQL.",
      "Build low-latency messaging queues using Redis and Apache Kafka.",
      "Enforce rigorous security standards, encryption, and audit logging for financial flows.",
      "Monitor system health, analyze distributed traces, and optimize database queries.",
    ],
    requirements: [
      "5+ years of experience building distributed backend systems.",
      "Expert knowledge of Node.js/TypeScript or Golang.",
      "Strong experience with relational databases (PostgreSQL) and caching (Redis).",
      "Hands-on experience with Docker, Kubernetes, and AWS cloud environments.",
    ],
    benefits: [
      "High base salary + attractive equity grant",
      "Full remote setup with internet reimbursement",
      "Zero-deductible health insurance covering parents",
      "Semi-annual performance bonuses",
    ],
  },
  {
    id: "4",
    title: "Growth Marketing Manager",
    company: "GreenField Foods",
    location: "Noida, Uttar Pradesh",
    type: "Full-time",
    workplace: "On-site",
    salary: "₹10L - ₹15L/yr",
    posted: "3 days ago",
    category: "Marketing",
    tags: ["SEO", "Performance Marketing", "Analytics"],
    aboutCompany:
      "GreenField Foods is India's premier organic food brand and supply network connecting 50,000+ local farmers directly with retail consumers.",
    companySize: "800+ employees",
    founded: "2017",
    industry: "AgriTech & Direct-to-Consumer",
    website: "greenfieldfoods.in",
    description:
      "Lead our digital growth engine across paid acquisition, lifecycle CRM, and viral brand campaigns. You will own customer acquisition cost (CAC) and lifetime value (LTV) optimization.",
    responsibilities: [
      "Manage high-budget performance marketing campaigns across Google, Meta, and LinkedIn.",
      "Analyze full-funnel conversion metrics and run ongoing A/B testing on landing pages.",
      "Collaborate with content creators to craft compelling organic brand narratives.",
      "Scale affiliate networks and strategic brand partnerships.",
    ],
    requirements: [
      "3+ years managing multi-channel paid acquisition and digital marketing.",
      "Strong analytical mindset with deep proficiency in Google Analytics and Mixpanel.",
      "Proven track record of scaling consumer or retail growth metrics.",
      "Energetic mindset with enthusiasm for sustainability and health foods.",
    ],
    benefits: [
      "Performance incentives tied to quarterly revenue targets",
      "Complimentary organic food hampers and wellness packages",
      "Comprehensive medical cover for family",
      "Exciting team offsites and learning seminars",
    ],
  },
  {
    id: "5",
    title: "Cloud DevOps Architect (AWS/Kubernetes)",
    company: "Apex Labs",
    location: "Pune, Maharashtra",
    type: "Full-time",
    workplace: "Remote",
    salary: "₹22L - ₹30L/yr",
    posted: "4 days ago",
    category: "Engineering",
    tags: ["AWS", "Kubernetes", "CI/CD", "Terraform"],
    aboutCompany:
      "Apex Labs creates enterprise autonomous intelligence tools and AI workflow acceleration platforms for global engineering organizations.",
    companySize: "600+ employees",
    founded: "2020",
    industry: "Artificial Intelligence & DevOps",
    website: "apexlabs.ai",
    description:
      "Lead our core infrastructure reliability and automated deployment pipelines. You will scale multi-region Kubernetes clusters, enforce zero-trust security, and automate cloud provisioning using Terraform.",
    responsibilities: [
      "Design and maintain automated cloud infrastructure across AWS using Terraform.",
      "Manage production Kubernetes clusters with auto-scaling and zero-downtime rollouts.",
      "Implement robust observability stacks using Prometheus, Grafana, and Datadog.",
      "Drive disaster recovery plans and cost-optimization strategies.",
    ],
    requirements: [
      "5+ years in DevOps, SRE, or Cloud Architecture roles.",
      "Expertise with AWS services (EKS, RDS, VPC, IAM) and Terraform.",
      "Solid proficiency in Linux scripting and CI/CD pipelines (GitHub Actions).",
      "Understanding of security compliance and vulnerability management.",
    ],
    benefits: [
      "Top 1% market compensation + generous stock option grants",
      "100% remote working with worldwide travel retreats",
      "Latest Apple M3 Max MacBook hardware package",
      "Unlimited paid time off policy",
    ],
  },
  {
    id: "6",
    title: "Product Manager (SaaS Platform)",
    company: "PixelForge Interactive",
    location: "Gurugram, Haryana",
    type: "Full-time",
    workplace: "Hybrid",
    salary: "₹16L - ₹22L/yr",
    posted: "5 days ago",
    category: "Product",
    tags: ["Product Strategy", "Agile", "User Research"],
    aboutCompany:
      "PixelForge Interactive is a digital studio engineering 3D immersive collaboration platforms and interactive simulation tools.",
    companySize: "320+ employees",
    founded: "2021",
    industry: "Interactive 3D Media & SaaS",
    website: "pixelforge.studio",
    description:
      "Drive product vision, roadmap prioritization, and feature execution for our collaborative 3D web platform. You'll bridge technical complexity with delightful user experiences.",
    responsibilities: [
      "Define quarterly OKRs and roadmap deliverables aligned with customer feedback.",
      "Translate high-level concepts into detailed functional requirements and user stories.",
      "Work closely with engineering, design, and marketing for on-time launches.",
      "Monitor product analytics to identify adoption bottlenecks and drive retention.",
    ],
    requirements: [
      "3+ years experience as a Product Manager in high-growth B2B or B2C SaaS.",
      "Strong technical literacy with ability to engage in engineering discussions.",
      "Data-driven decision making and excellent stakeholder management.",
      "Experience with Agile/Scrum methodologies.",
    ],
    benefits: [
      "Hybrid flexibility with flexible hours",
      "Annual profit-sharing bonus scheme",
      "Executive coaching and leadership development",
      "Comprehensive healthcare and dental coverage",
    ],
  },
  {
    id: "7",
    title: "Financial Analyst & Strategy",
    company: "Apex Labs",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    workplace: "Hybrid",
    salary: "₹12L - ₹16L/yr",
    posted: "1 week ago",
    category: "Finance",
    tags: ["Financial Modeling", "Excel", "Forecasting"],
    aboutCompany:
      "Apex Labs creates enterprise autonomous intelligence tools and AI workflow acceleration platforms for global engineering organizations.",
    companySize: "600+ employees",
    founded: "2020",
    industry: "Artificial Intelligence & DevOps",
    website: "apexlabs.ai",
    description:
      "Join our strategic finance unit to evaluate growth models, conduct revenue forecasting, and prepare board-level financial reports.",
    responsibilities: [
      "Build complex financial models for SaaS unit economics and recurring revenue.",
      "Collaborate with executive teams on budget allocations and cash runway management.",
      "Perform competitor analysis and market benchmarking.",
      "Automate financial dashboards and MIS reporting.",
    ],
    requirements: [
      "2-4 years in corporate finance, investment banking, or management consulting.",
      "High proficiency in advanced financial modeling and Excel.",
      "Degree in Finance, Economics, or CA/CFA qualification.",
      "Strong presentation and analytical skills.",
    ],
    benefits: [
      "Lucrative performance bonuses",
      "Executive mentoring from seasoned CFOs",
      "Premium health insurance",
      "Fast-track promotion cycle",
    ],
  },
  {
    id: "8",
    title: "People & Talent Acquisition Lead",
    company: "NovaTech Solutions",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    workplace: "Hybrid",
    salary: "₹10L - ₹14L/yr",
    posted: "1 week ago",
    category: "HR",
    tags: ["Tech Hiring", "People Ops", "Culture"],
    aboutCompany:
      "NovaTech Solutions is an enterprise cloud computing company building high-scale developer platforms and SaaS infrastructures trusted by Fortune 500 teams.",
    companySize: "1,200+ employees",
    founded: "2018",
    industry: "Enterprise Cloud & Software",
    website: "novatech-solutions.io",
    description:
      "Spearhead our engineering and product hiring initiatives across India. You will build talent pipelines, conduct cultural assessments, and champion employee engagement.",
    responsibilities: [
      "Lead full lifecycle technical recruiting from candidate sourcing to offer rollout.",
      "Partner with engineering leaders to understand headcount priorities.",
      "Design an engaging, transparent candidate onboarding experience.",
      "Represent NovaTech at university placement drives and tech community meetups.",
    ],
    requirements: [
      "3+ years experience in technical talent acquisition or HR operations.",
      "Proven track record of closing high-caliber engineering candidates.",
      "Strong negotiation and interpersonal communication skills.",
      "Experience with modern ATS platforms like Greenhouse or Lever.",
    ],
    benefits: [
      "Commission on critical senior hires",
      "Flexible hybrid working mode",
      "Comprehensive family health plan",
      "Wellness allowances and paid annual vacation",
    ],
  },
];
