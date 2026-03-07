"use client";

import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: React.ReactNode;
}

export function InteractiveHoverButton({
  text = "Button",
  children,
  className = "",
  type = "button",
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      type={type}
      className={
        "group flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.98] " +
        className
      }
      {...props}
    >
      {children ?? text}
      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  );
}
