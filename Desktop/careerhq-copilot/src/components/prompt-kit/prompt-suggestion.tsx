"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PromptSuggestionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  highlight?: string;
}

export function PromptSuggestion({
  children,
  className,
  highlight,
  ...props
}: PromptSuggestionProps) {
  // Only process highlighting when both children is a string and we have a highlight term
  const highlightedContent = React.useMemo(() => {
    if (typeof children !== "string" || !highlight) {
      return children;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = children.split(regex);

    if (parts.length <= 1) {
      return children;
    }

    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="font-medium text-foreground">
          {part}
        </span>
      ) : (
        part
      )
    );
  }, [children, highlight]);

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-auto justify-start rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted",
        className
      )}
      {...props}
    >
      {highlightedContent}
    </Button>
  );
}
