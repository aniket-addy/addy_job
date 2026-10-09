import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import JobCategories from "@/components/JobCategories";
import RecommendedJobs from "@/components/RecommendedJobs";
import TopCompanies from "@/components/TopCompanies";
import TopCompaniesCards from "@/components/TopCompaniesCards";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsAndCTA from "@/components/TestimonialsAndCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar activeTab="Home" />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        {/* 2. Hero Banner */}
        <HeroBanner />

        {/* 3. Recommended Jobs (Directly follows Hero on mobile matching reference UI) */}
        <div className="order-1 md:order-2">
          <RecommendedJobs />
        </div>

        {/* 4. Explore Jobs by Category */}
        <div className="order-2 md:order-1">
          <JobCategories />
        </div>

        {/* 5. Trusted by Top Companies & Top Companies Cards */}
        <div className="order-3">
          <TopCompanies />
          <TopCompaniesCards />
        </div>

        {/* 6. Get Hired in 4 Easy Steps (Hidden on mobile) */}
        <div className="hidden md:block order-4">
          <HowItWorks />
        </div>

        {/* 7. Success Stories & CTA Banner */}
        <div className="order-5">
          <TestimonialsAndCTA />
        </div>
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
