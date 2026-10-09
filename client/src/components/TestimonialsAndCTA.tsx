"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Send, ArrowRight, Quote, CheckCircle2 } from "lucide-react";

interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  timeframe: string;
  rating: number;
  quote: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: "1",
    name: "Rohit Sharma",
    role: "Frontend Developer",
    company: "NovaTech Solutions",
    timeframe: "Hired in 3 weeks",
    rating: 5,
    quote:
      "AddyJob made my job search so easy! The direct recommendations matched my exact tech stack, and I secured my dream role within 3 weeks. Fast, clean and reliable.",
    avatar: "/reviewer-1.jpg",
  },
  {
    id: "2",
    name: "Priya Patel",
    role: "UI/UX Designer",
    company: "BrightPath Digital",
    timeframe: "Hired in 2 weeks",
    rating: 5,
    quote:
      "The 1-click apply feature saved me dozens of hours. Companies actually respond here instead of your application disappearing into a black hole. Highly recommended!",
    avatar: "/reviewer-2.jpg",
  },
  {
    id: "3",
    name: "Amit Verma",
    role: "Backend Developer",
    company: "Skyline Tech",
    timeframe: "Hired in 1 month",
    rating: 5,
    quote:
      "Salary transparency and company insights gave me huge confidence during interviews. I received two top offers through AddyJob with a 40% salary hike.",
    avatar: "/reviewer-3.png",
  },
  {
    id: "4",
    name: "Sneha Rao",
    role: "Data Analyst",
    company: "GreenField Foods",
    timeframe: "Hired in 3 weeks",
    rating: 5,
    quote:
      "The career portal gave me verified recruiter contacts. Within 20 days, I transitioned into an analytics role with an amazing team and flexible remote setup.",
    avatar: "/reviewer-4.jpg",
  },
  {
    id: "5",
    name: "Vikram Malhotra",
    role: "DevOps Engineer",
    company: "Apex Labs",
    timeframe: "Hired in 10 days",
    rating: 5,
    quote:
      "The fastest hiring pipeline I've ever experienced! Applied on Tuesday, had technical rounds by Friday, and received the offer letter early next week.",
    avatar: "/reviewer-5.jpg",
  },
  {
    id: "6",
    name: "Ananya Gupta",
    role: "Product Manager",
    company: "PixelForge",
    timeframe: "Hired in 4 weeks",
    rating: 5,
    quote:
      "AddyJob stands out from all traditional job boards. Curated listings, verified salary brackets, and rapid responses made my job switch completely stress-free.",
    avatar: "/reviewer-6.jpg",
  },
];

// Duplicate 6 reviews for seamless infinite loop
const marqueeReviews = [...reviews, ...reviews];

export default function TestimonialsAndCTA() {
  // Spring physics system for mobile community card
  const cardRef = useRef<HTMLDivElement>(null);
  const [springY, setSpringY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const touchStartY = useRef(0);
  const isPullingUpRef = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      isDraggingRef.current = true;
      isPullingUpRef.current = false;
      setIsDragging(true);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const currentY = e.touches[0].clientY;
      const delta = currentY - touchStartY.current;

      // When dragging UP (delta < 0) towards navbar (Image 1)
      if (delta < -3 || isPullingUpRef.current) {
        isPullingUpRef.current = true;
        if (e.cancelable) {
          e.preventDefault(); // Stop native page scroll so screen doesn't get pushed away
        }
        // Elastic pull up towards navbar
        const damped = Math.max(delta * 0.85, -280);
        setSpringY(damped);
      } else if (delta > 0 && !isPullingUpRef.current) {
        // Dragging slightly down: small rubber band
        setSpringY(Math.min(delta * 0.15, 25));
      }
    };

    const onTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      isPullingUpRef.current = false;
      setIsDragging(false);
      // Automatically spring back DOWN to resting position (Image 2)
      setSpringY(0);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  // Support mouse dragging for desktop responsive mobile preview
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartY.current = e.clientY;
    isDraggingRef.current = true;
    isPullingUpRef.current = false;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientY - touchStartY.current;
    if (delta < 0 || isPullingUpRef.current) {
      isPullingUpRef.current = true;
      const damped = Math.max(delta * 0.85, -280);
      setSpringY(damped);
    } else {
      setSpringY(Math.min(delta * 0.15, 25));
    }
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      isPullingUpRef.current = false;
      setIsDragging(false);
      // Spring back down to Image 2
      setSpringY(0);
    }
  };

  return (
    <section id="get-hired" className="pt-10 pb-4 sm:py-20 bg-slate-50/50 overflow-hidden scroll-mt-24">
      {/* Inline styles for guaranteed Left-to-Right infinite scroll */}
      <style>{`
        @keyframes scrollLeftToRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .infinite-reviews-slider {
          display: flex;
          width: max-content;
          animation: scrollLeftToRight 40s linear infinite;
          will-change: transform;
        }
        .infinite-reviews-slider:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF] mb-3">
              Success Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Our Job Seekers Say
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Real reviews from professionals who advanced their careers with AddyJob.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-full border border-slate-200/80 shadow-xs self-start sm:self-auto">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span>4.9 / 5 from 12,000+ reviews</span>
          </div>
        </div>

        {/* Infinite Left-to-Right Carousel Track (aligned with container) */}
        <div className="relative w-full overflow-hidden mb-6 md:mb-16 py-3">
          {/* Left Gradient Fade Mask */}
          <div className="absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 via-slate-50/70 to-transparent z-10 pointer-events-none" />

          {/* Right Gradient Fade Mask */}
          <div className="absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 via-slate-50/70 to-transparent z-10 pointer-events-none" />

          {/* Moving Track */}
          <div className="infinite-reviews-slider flex items-stretch gap-6 pr-6">
            {marqueeReviews.map((rev, idx) => (
              <div
                key={`${rev.id}-${idx}`}
                className="w-[340px] sm:w-[390px] shrink-0 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_14px_32px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group cursor-default"
              >
                <div>
                  {/* Top Row: Stars + Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Quote className="w-4 h-4 fill-current opacity-60" />
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal line-clamp-4">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                {/* Reviewer Details + Verified Placement Badge */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-100 shrink-0">
                      <Image
                        src={rev.avatar}
                        alt={rev.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm truncate">
                          {rev.name}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {rev.role}
                      </p>
                      <span className="inline-block mt-0.5 text-[11px] font-semibold text-blue-600 truncate">
                        {rev.company} • {rev.timeframe}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-Only Community CTA Card with Spring System */}
        <div className="block md:hidden mt-4 mb-2 select-none">
          <div
            ref={cardRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `translate3d(0, ${springY}px, 0)`,
              transition: isDragging
                ? "none"
                : "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
              willChange: "transform",
            }}
            className="relative bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden cursor-grab active:cursor-grabbing"
          >
            {/* Spring Drag Handle */}
            <div className="w-10 h-1 rounded-full bg-slate-200/90 mx-auto mb-3" />

            {/* Background Soft Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-100/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/80 mb-3">
                Join Our Community
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                Let&apos;s Build <br />
                Your <span className="text-amber-500">Brighter</span> <br />
                Future Together
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 max-w-[260px]">
                Get personalized job recommendations, career insights and connect with top employers.
              </p>

              {/* Floating Candidate & Company Graphics */}
              <div className="relative w-full h-24 my-2">
                {/* Candidate Avatar 1 */}
                <div className="absolute left-1 top-2 w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                  <Image src="/reviewer-1.jpg" alt="Candidate" width={40} height={40} className="w-full h-full object-cover" />
                </div>

                {/* Google Icon Badge */}
                <div className="absolute left-14 top-0 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-1.5">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>

                {/* Candidate Avatar 2 */}
                <div className="absolute left-24 top-3 w-9 h-9 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                  <Image src="/reviewer-2.jpg" alt="Candidate" width={36} height={36} className="w-full h-full object-cover" />
                </div>

                {/* Microsoft Icon Badge */}
                <div className="absolute right-14 top-1 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-1.5">
                  <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                    <span className="bg-[#F25022] w-1.5 h-1.5 rounded-xs" />
                    <span className="bg-[#7FBA00] w-1.5 h-1.5 rounded-xs" />
                    <span className="bg-[#00A4EF] w-1.5 h-1.5 rounded-xs" />
                    <span className="bg-[#FFB900] w-1.5 h-1.5 rounded-xs" />
                  </div>
                </div>

                {/* Amazon Icon Badge */}
                <div className="absolute left-10 bottom-0 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-1">
                  <span className="text-[11px] font-black text-slate-800">a</span>
                </div>

                {/* Candidate Avatar 3 */}
                <div className="absolute left-32 bottom-0 w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                  <Image src="/reviewer-3.png" alt="Candidate" width={40} height={40} className="w-full h-full object-cover" />
                </div>

                {/* Get Hired Pill Badge with dashed arrow */}
                <div className="absolute right-2 bottom-1 flex flex-col items-center">
                  <div className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF] font-bold text-[11px] shadow-xs">
                    Get Hired
                  </div>
                </div>

                {/* Curved Dashed Arrow */}
                <svg className="absolute right-12 bottom-0 w-24 h-12 pointer-events-none" viewBox="0 0 100 50" fill="none">
                  <path d="M10 40 C 40 50, 60 40, 75 25" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
                  <polygon points="75,20 80,28 72,28" fill="#F59E0B" />
                </svg>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                <Link
                  href="/jobs"
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#FBBF24] hover:bg-amber-400 active:scale-98 text-slate-900 font-bold text-xs sm:text-sm text-center shadow-sm flex items-center justify-center gap-1.5 transition"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/jobs"
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-slate-50 active:scale-98 text-slate-700 font-bold text-xs sm:text-sm text-center border border-slate-200 transition"
                >
                  Explore Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div id="create-profile" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="hidden md:flex relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 sm:p-10 shadow-xl shadow-blue-600/20 text-white flex-col md:flex-row items-center justify-between gap-6">
          {/* Background subtle glow shapes */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-60 h-60 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Left Text */}
          <div className="flex items-center gap-4 z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shrink-0">
              <Send className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Ready to Build Your Profile & Career?
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Join thousands of job seekers. Create your profile in minutes and start applying.
              </p>
            </div>
          </div>

          {/* Right Button */}
          <Link
            href="/signup?role=job_seeker"
            className="z-10 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-blue-600 hover:bg-blue-50 active:scale-98 font-bold text-sm shadow-lg shadow-black/10 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Create Profile Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
