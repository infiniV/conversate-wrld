"use client";

import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Loader = ({ size = "md", className }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "border-t-transparent animate-spin rounded-full",
          sizeClasses[size]
        )}
        style={{
          borderColor: "rgba(255, 61, 113, 0.3)",
          borderTopColor: "rgba(255, 61, 113, 1)",
        }}
      />
    </div>
  );
};
