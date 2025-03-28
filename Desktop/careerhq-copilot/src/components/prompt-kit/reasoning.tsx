"use client";

import * as React from "react";
import { ChevronDown, Braces } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/prompt-kit/markdown"; // Assuming this exists

// Type definitions for the reasoning components
interface ReasoningProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

interface ReasoningTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

interface ReasoningContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ReasoningResponseProps {
  text: string;
  className?: string;
}

// Main Reasoning component (container)
export function Reasoning({
  open,
  onOpenChange,
  className,
  children,
}: ReasoningProps) {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className={cn("w-full", className)}
    >
      {children}
    </Collapsible>
  );
}

// Reasoning trigger component
export function ReasoningTrigger({
  children,
  className,
}: ReasoningTriggerProps) {
  return (
    <CollapsibleTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-1 p-0 text-xs font-medium text-muted-foreground hover:text-foreground",
          className
        )}
      >
        <Braces className="h-3.5 w-3.5" />
        {children || "View reasoning"}
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
    </CollapsibleTrigger>
  );
}

// Reasoning content component
export function ReasoningContent({
  children,
  className,
}: ReasoningContentProps) {
  return (
    <CollapsibleContent
      className={cn("overflow-hidden text-sm text-muted-foreground", className)}
    >
      {children}
    </CollapsibleContent>
  );
}

// Reasoning response component (handles formatting of reasoning)
export function ReasoningResponse({
  text,
  className,
}: ReasoningResponseProps) {
  return (
    <div className={cn("reasoning-response space-y-2", className)}>
      {/* If Markdown component exists, use it, otherwise just render as pre */}
      {typeof Markdown !== "undefined" ? (
        <Markdown>{text}</Markdown>
      ) : (
        <pre className="whitespace-pre-wrap font-mono text-xs">{text}</pre>
      )}
    </div>
  );
}
