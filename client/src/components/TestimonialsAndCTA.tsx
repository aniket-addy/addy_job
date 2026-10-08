"use client";

import React from "react";
import Image from "next/image";
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
      "CareerConnect made my job search so easy! The direct recommendations matched my exact tech stack, and I secured my dream role within 3 weeks. Fast, clean and reliable.",
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
      "Salary transparency and company insights gave me huge confidence during interviews. I received two top offers through CareerConnect with a 40% salary hike.",
    avatar: "/reviewer-3.png",
  },
];

export default function TestimonialsAndCTA() {
  return (
    <section className="py-14 sm:py-20 bg-slate-50/50">
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
              Real reviews from professionals who advanced their careers with CareerConnect.
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

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group"
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
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
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
                    <span className="inline-block mt-0.5 text-[11px] font-semibold text-blue-600">
                      {rev.company} • {rev.timeframe}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 sm:p-10 shadow-xl shadow-blue-600/20 text-white flex flex-col md:flex-row items-center justify-between gap-6">
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
                Ready to Build Your Future?
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Join thousands of job seekers and take the next step in your career.
              </p>
            </div>
          </div>

          {/* Right Button */}
          <a
            href="#"
            className="z-10 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-blue-600 hover:bg-blue-50 active:scale-98 font-bold text-sm shadow-lg shadow-black/10 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
