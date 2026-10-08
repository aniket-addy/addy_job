import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import JobCategories from "@/components/JobCategories";
import RecommendedJobs from "@/components/RecommendedJobs";
import TopCompanies from "@/components/TopCompanies";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsAndCTA from "@/components/TestimonialsAndCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar activeTab="Home" />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Banner */}
        <HeroBanner />

        {/* 3. Explore Jobs by Category */}
        <JobCategories />

        {/* 4. Recommended Jobs */}
        <RecommendedJobs />

        {/* 5. Trusted by Top Companies */}
        <TopCompanies />

        {/* 6. Get Hired in 4 Easy Steps */}
        <HowItWorks />

        {/* 7. Success Stories & CTA Banner */}
        <TestimonialsAndCTA />
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
