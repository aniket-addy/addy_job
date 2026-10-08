"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function GrowthChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState("Last 8 Months");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

  // Data series matching the graph visually
  // Y-axis scale: 0 to 20K (mapped to 0 - 200px height)
  const companiesData = [1.2, 2.5, 3.4, 4.2, 5.0, 5.8, 7.2, 8.5]; // in K
  const jobsData = [3.5, 5.2, 6.8, 8.0, 9.5, 10.8, 12.5, 15.2]; // in K
  const appsData = [2.0, 3.8, 5.0, 6.5, 8.2, 10.0, 13.8, 18.2]; // in K

  // Chart dimensions in SVG coordinates
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 20;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Convert (index, value) to SVG (x, y)
  const getX = (i: number) => paddingX + (i / (months.length - 1)) * chartW;
  const getY = (val: number) => paddingY + chartH - (val / 20) * chartH;

  // Generate smooth SVG bezier path
  const createSplinePath = (data: number[]) => {
    const points = data.map((v, i) => ({ x: getX(i), y: getY(v) }));
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const companiesPath = createSplinePath(companiesData);
  const jobsPath = createSplinePath(jobsData);
  const appsPath = createSplinePath(appsData);

  // Closed area paths for gradient fills
  const createAreaPath = (linePath: string, data: number[]) => {
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const bottomY = paddingY + chartH;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      {/* Header with Title, Legends and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Platform Growth Overview
          </h3>
          <div className="mt-1 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              Companies
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              Jobs
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
              Applications
            </span>
          </div>
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative inline-block text-left self-start sm:self-auto">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <span>{timeframe}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative mt-4 w-full h-[220px]">
        {/* Y Axis Labels */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[11px] font-medium text-slate-400 pointer-events-none select-none">
          <span>20K</span>
          <span>15K</span>
          <span>10K</span>
          <span>5K</span>
          <span>0</span>
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible pl-6 sm:pl-8"
        >
          <defs>
            <linearGradient id="appsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 5, 10, 15, 20].map((v) => (
            <line
              key={v}
              x1={paddingX}
              y1={getY(v)}
              x2={paddingX + chartW}
              y2={getY(v)}
              stroke="#F1F5F9"
              strokeWidth="1"
              strokeDasharray={v === 0 ? "none" : "3 3"}
            />
          ))}

          {/* Fills */}
          <path d={createAreaPath(appsPath, appsData)} fill="url(#appsGrad)" />
          <path d={createAreaPath(jobsPath, jobsData)} fill="url(#jobsGrad)" />
          <path d={createAreaPath(companiesPath, companiesData)} fill="url(#compGrad)" />

          {/* Curves */}
          <path
            d={companiesPath}
            fill="none"
            stroke="#6366F1"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={jobsPath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={appsPath}
            fill="none"
            stroke="#14B8A6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive Dots & Tooltip trigger columns */}
          {months.map((m, i) => {
            const cx = getX(i);
            const isHovered = hoveredIndex === i;

            return (
              <g key={m}>
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={paddingY + chartH}
                    stroke="#94A3B8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Dots on line */}
                <circle
                  cx={cx}
                  cy={getY(companiesData[i])}
                  r={isHovered ? 5 : 3.5}
                  fill="#FFFFFF"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                />
                <circle
                  cx={cx}
                  cy={getY(jobsData[i])}
                  r={isHovered ? 5 : 3.5}
                  fill="#FFFFFF"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
                <circle
                  cx={cx}
                  cy={getY(appsData[i])}
                  r={isHovered ? 5 : 3.5}
                  fill="#FFFFFF"
                  stroke="#14B8A6"
                  strokeWidth="2.5"
                />

                {/* Broad transparent column for comfortable hovering */}
                <rect
                  x={cx - 20}
                  y={paddingY}
                  width={40}
                  height={chartH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-3 pointer-events-none transform -translate-x-1/2 bg-slate-900/95 text-white text-[11px] px-2.5 py-1.5 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm z-20"
            style={{
              left: `${(hoveredIndex / (months.length - 1)) * 82 + 12}%`,
            }}
          >
            <div className="font-bold text-slate-300 pb-0.5 border-b border-slate-800">
              {months[hoveredIndex]} 2025
            </div>
            <div className="pt-1 space-y-0.5 font-medium">
              <div className="flex items-center gap-1.5 text-indigo-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Companies: {(companiesData[hoveredIndex] * 1000).toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-blue-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Jobs: {(jobsData[hoveredIndex] * 1000).toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-teal-300">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Apps: {(appsData[hoveredIndex] * 1000).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between pl-8 sm:pl-10 pr-2 pt-2 text-xs font-semibold text-slate-400">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}
