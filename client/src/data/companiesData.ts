export interface Company {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  location: string;
  size: string;
  rating: number;
  reviewsCount: string;
  recommendRate: string;
  ceoApproval: string;
  followers: string;
  companyType: string;
  openRoles: number;
  about: string;
  founded: string;
  website: string;
  gstNumber?: string;
  phone?: string;
  iconName: "Layers" | "Sparkles" | "Sprout" | "Globe" | "Boxes" | "Triangle";
  iconBg: string;
  color: string;
  accentColor: string;
  bannerGradient: string;
  initials: string;
  culture: string[];
  perks: string[];
}

export const companiesList: Company[] = [
  {
    id: "1",
    name: "NovaTech Solutions",
    tagline: "Enterprise cloud computing infrastructure & high-scale developer platform ecosystems.",
    industry: "Enterprise Software & Cloud",
    location: "Bengaluru, Karnataka",
    size: "1,200+ employees",
    rating: 4.8,
    reviewsCount: "420",
    recommendRate: "94%",
    ceoApproval: "97%",
    followers: "28.4k",
    companyType: "Private • Series D",
    openRoles: 4,
    about:
      "NovaTech Solutions is an enterprise cloud computing company building high-scale developer platforms, distributed Kubernetes control planes, and SaaS infrastructures trusted by Fortune 500 teams worldwide.",
    founded: "2018",
    website: "novatech-solutions.io",
    gstNumber: "29AABCN1234F1Z6",
    phone: "+91 80 4123 4567",
    iconName: "Layers",
    iconBg: "bg-blue-50 border-blue-100",
    color: "text-blue-600",
    accentColor: "from-blue-600 to-indigo-700",
    bannerGradient: "from-slate-900 via-blue-950 to-indigo-900",
    initials: "NT",
    culture: [
      "Asynchronous & remote-first collaboration",
      "Bi-annual engineering hackathons",
      "Transparent leadership & open compensation bands",
      "Dedicated focus on work-life harmony",
    ],
    perks: [
      "100% remote flexibility & home office budget",
      "Premium family health & dental insurance",
      "Generous ESOP stock options program",
      "₹1,20,000 annual learning & development stipend",
    ],
  },
  {
    id: "2",
    name: "BrightPath Digital",
    tagline: "Award-winning human-centered product studio creating intuitive digital experiences for global high-growth brands.",
    industry: "Design & UX Innovations",
    location: "Mohali, Punjab",
    size: "450+ employees",
    rating: 4.9,
    reviewsCount: "284",
    recommendRate: "96%",
    ceoApproval: "98%",
    followers: "14.2k",
    companyType: "Privately Held Studio",
    openRoles: 3,
    about:
      "Award-winning human-centered digital studio specializing in world-class design systems, consumer mobile apps, and enterprise web experiences for high-growth global startups and legacy enterprises.",
    founded: "2019",
    website: "brightpathdigital.com",
    gstNumber: "03AABCB5678D1Z2",
    phone: "+91 172 509 8899",
    iconName: "Sparkles",
    iconBg: "bg-rose-50 border-rose-100",
    color: "text-rose-500",
    accentColor: "from-rose-500 to-pink-600",
    bannerGradient: "from-slate-900 via-rose-950 to-pink-950",
    initials: "BP",
    culture: [
      "User-first design mindset in every sprint",
      "Weekly creative critique & discovery sessions",
      "Collaborative hybrid studio environments",
      "No meeting Wednesdays for deep focus",
    ],
    perks: [
      "MacBook Pro M3 Max & 4K monitor setup",
      "Flexible hybrid working with ergonomic allowances",
      "Health & mental wellness memberships",
      "Annual team offsites in Goa & Himachal",
    ],
  },
  {
    id: "3",
    name: "GreenField Foods",
    tagline: "Revolutionizing modern agricultural logistics and sustainable clean food supply chains across India.",
    industry: "AgriTech & Sustainable Supply",
    location: "Noida, Uttar Pradesh",
    size: "800+ employees",
    rating: 4.7,
    reviewsCount: "190",
    recommendRate: "92%",
    ceoApproval: "95%",
    followers: "18.6k",
    companyType: "Growth Stage D2C",
    openRoles: 3,
    about:
      "India's premier organic food brand and sustainable farm-to-door network connecting over 50,000 local farmers directly with consumers using cutting-edge predictive logistics and cold-chain IoT.",
    founded: "2017",
    website: "greenfieldfoods.in",
    gstNumber: "09AABCG9101E1Z3",
    phone: "+91 120 488 2211",
    iconName: "Sprout",
    iconBg: "bg-emerald-50 border-emerald-100",
    color: "text-emerald-600",
    accentColor: "from-emerald-600 to-teal-700",
    bannerGradient: "from-slate-900 via-emerald-950 to-teal-950",
    initials: "GF",
    culture: [
      "Impact-driven mission for farmer welfare",
      "Sustainability and zero-carbon practices",
      "High ownership and fast execution cycles",
      "Celebration of grassroots innovation",
    ],
    perks: [
      "Quarterly performance revenue bonuses",
      "Complimentary organic food hampers monthly",
      "Full family medical coverage including parents",
      "On-site fitness centers & subsidized cafeteria",
    ],
  },
  {
    id: "4",
    name: "Skyline Technologies",
    tagline: "Powering real-time global financial transactions, decentralized ledgers, and secure payment switches.",
    industry: "Fintech & Global Banking",
    location: "Hyderabad, Telangana",
    size: "2,500+ employees",
    rating: 4.8,
    reviewsCount: "680",
    recommendRate: "95%",
    ceoApproval: "99%",
    followers: "42.1k",
    companyType: "Enterprise Unicorn",
    openRoles: 3,
    about:
      "Skyline Technologies is a fintech powerhouse facilitating real-time transactions, payment infrastructure, and banking APIs handling over $20B in monthly payment flows with 99.999% uptime.",
    founded: "2016",
    website: "skyline-tech.com",
    gstNumber: "36AABCS2345K1Z4",
    phone: "+91 40 6712 9000",
    iconName: "Globe",
    iconBg: "bg-sky-50 border-sky-100",
    color: "text-sky-500",
    accentColor: "from-sky-600 to-blue-700",
    bannerGradient: "from-slate-900 via-sky-950 to-blue-950",
    initials: "SK",
    culture: [
      "Data-driven engineering decisions",
      "Zero-tolerance security & compliance standards",
      "Continuous peer mentorship programs",
      "Merit-based fast-track promotions",
    ],
    perks: [
      "Top-tier compensation + high annual bonuses",
      "Comprehensive zero-deductible health plans",
      "Broad equity ownership across all full-time roles",
      "Paid paternal & maternal leaves (26 weeks)",
    ],
  },
  {
    id: "5",
    name: "PixelForge Interactive",
    tagline: "Crafting immersive 3D simulations, real-time multiplayer titles, and interactive virtual media tools.",
    industry: "Gaming & Interactive Media",
    location: "Gurugram, Haryana",
    size: "320+ employees",
    rating: 4.6,
    reviewsCount: "145",
    recommendRate: "91%",
    ceoApproval: "93%",
    followers: "11.8k",
    companyType: "Independent Studio",
    openRoles: 3,
    about:
      "Creating immersive 3D multiplayer environments, WebGL simulations, and state-of-the-art interactive digital twins for entertainment, engineering, and virtual training applications worldwide.",
    founded: "2021",
    website: "pixelforge.studio",
    gstNumber: "06AABCP3456L1Z5",
    phone: "+91 124 456 7890",
    iconName: "Boxes",
    iconBg: "bg-purple-50 border-purple-100",
    color: "text-purple-600",
    accentColor: "from-purple-600 to-indigo-700",
    bannerGradient: "from-slate-900 via-purple-950 to-indigo-950",
    initials: "PF",
    culture: [
      "Passion for cutting-edge real-time graphics",
      "Playful, creative sandbox team environment",
      "Experimentation-friendly project incubator",
      "Open source contributions welcomed",
    ],
    perks: [
      "High-end RTX 4090 GPU development rigs",
      "Flexible hybrid hours (core overlap 11am-4pm)",
      "Annual game & hardware allowance",
      "Regular esports tournament game nights",
    ],
  },
  {
    id: "6",
    name: "Apex Labs",
    tagline: "Pioneering autonomous intelligence, domain-specific foundation LLMs, and enterprise AI workflows.",
    industry: "Artificial Intelligence & Robotics",
    location: "Pune, Maharashtra",
    size: "600+ employees",
    rating: 4.9,
    reviewsCount: "310",
    recommendRate: "97%",
    ceoApproval: "99%",
    followers: "36.5k",
    companyType: "AI Research Unicorn",
    openRoles: 3,
    about:
      "Pioneering autonomous intelligence systems, domain-specific foundation LLMs, and robotics control middleware designed to revolutionize manufacturing, health informatics, and aerospace operations.",
    founded: "2020",
    website: "apexlabs.ai",
    gstNumber: "27AABCA7890M1Z8",
    phone: "+91 20 6689 3300",
    iconName: "Triangle",
    iconBg: "bg-cyan-50 border-cyan-100",
    color: "text-cyan-600",
    accentColor: "from-cyan-600 to-blue-700",
    bannerGradient: "from-slate-900 via-cyan-950 to-blue-950",
    initials: "AL",
    culture: [
      "Deep scientific rigor & research culture",
      "Publication support for top AI conferences",
      "Extreme autonomy and rapid prototyping",
      "Collaborative multidisciplinary teams",
    ],
    perks: [
      "Generous compute cluster access (H100 GPUs)",
      "High equity stakes in high-growth AI unicorn",
      "Unlimited paid time off & mental health days",
      "International conference travel sponsorships",
    ],
  },
];
