"use client";

import React from "react";
import EmployerSignupView from "@/components/EmployerSignupView";
import { useRouter } from "next/navigation";

export default function EmployerDirectSignupPage() {
  const router = useRouter();

  return (
    <EmployerSignupView
      onSwitchToJobSeeker={() => {
        router.push("/signup?role=job_seeker");
      }}
    />
  );
}
