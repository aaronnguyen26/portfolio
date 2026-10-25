"use client";

import React from "react";
import { useResume } from "@/components/ResumeModal";

interface ResumeButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  mode?: "picker" | "viewer";
  children?: React.ReactNode;
}

export default function ResumeButton({
  mode = "picker",
  children = "Resume (PDF) ↗",
  className,
  style,
  ...props
}: ResumeButtonProps) {
  const { openResume } = useResume();

  return (
    <a
      href="/resume.pdf"
      onClick={(e) => {
        e.preventDefault();
        openResume(mode);
      }}
      className={className}
      style={{ cursor: "pointer", ...style }}
      {...props}
    >
      {children}
    </a>
  );
}
