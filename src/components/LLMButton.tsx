"use client";

import React from "react";
import { useLLM } from "@/components/LLMModal";

interface LLMButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

export default function LLMButton({
  children,
  className,
  style,
  ...props
}: LLMButtonProps) {
  const { openLLM } = useLLM();

  return (
    <a
      href="/llms.txt"
      onClick={(e) => {
        // If meta/ctrl key or middle click, let browser open link directly
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        openLLM();
      }}
      className={className}
      style={{ cursor: "pointer", ...style }}
      {...props}
    >
      {children || "llm.txt"}
    </a>
  );
}
