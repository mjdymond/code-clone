"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language: string;
  value: string;
  className?: string;
}

export function CodeBlock({
  language,
  value,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative my-4 rounded-md bg-muted", className)} {...props}>
      <div className="flex items-center justify-between rounded-t-md border-b bg-muted px-4 py-1.5">
        <div className="text-xs lowercase text-muted-foreground">
          {language || "code"}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-xs text-muted-foreground">{value}</code>
      </pre>
    </div>
  );
}
