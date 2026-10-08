"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Send, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Rohit Sharma",
    role: "Frontend Developer • 3 months",
    quote:
      "CareerConnect made my job search so easy! I found my dream role within 3 weeks. The platform is simple, fast and reliable.",
    avatar: "/avatar.png",
  },
  {
    name: "Priya Patel",
    role: "UI/UX Designer • 1 month",
    quote:
      "The recommended jobs were accurate and the one-click apply feature saved me dozens of hours. Got hired at a top tech company!",
    avatar: "/avatar.png",
  },
];

export default function TestimonialsAndCTA() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prev = () => {
    setCurrentIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  };

  const item = testimonials[currentIdx];

  return (
    <section className="py-14 sm:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF] mb-3">
            Success Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What Our Job Seekers Say
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] mb-12 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
          {/* Prev Button */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="hidden md:flex w-10 h-10 rounded-full border border-slate-200 items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-400 transition cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-blue-50 shrink-0">
            <Image
              src={item.avatar}
              alt={item.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quote & Author */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed mb-4">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div>
              <h4 className="font-bold text-slate-900 text-base">{item.name}</h4>
              <p className="text-xs sm:text-sm text-slate-500">{item.role}</p>
            </div>
          </div>

          {/* Dots Indicator & Next Button */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIdx ? "w-5 bg-blue-600" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-400 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
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
                Join thousands of job seekers and take the next step in your
                career.
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
