"use client";

import {
  BriefcaseIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  FilmIcon,
  PlayCircleIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BriefcaseIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  FilmIcon,
  PlayCircleIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  HomeIcon,
};

export function CategoryIcon({ icon, className = "h-5 w-5" }: { icon: string; className?: string }) {
  const C = MAP[icon];
  if (!C) return null;
  return <C className={className} />;
}
