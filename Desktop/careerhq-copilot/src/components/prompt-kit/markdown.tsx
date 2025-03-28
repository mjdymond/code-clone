"use client";

import React from "react";
import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./code-block"; // Assuming this exists

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
        className
      )}
      remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        code({ node, inline, className, children, ...props }) {
          if (inline) {
            return (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                {children}
              </code>
            );
          }
          
          const match = /language-(\w+)/.exec(className || "");
          const lang = match && match[1];
          
          return (
            <CodeBlock
              key={Math.random()}
              language={lang || ""}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          );
        },
        a({ children, href }) {
          const isExternal = href?.startsWith("http");
          return (
            <a
              href={href}
              className="underline decoration-primary underline-offset-2 transition-colors hover:text-primary"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          );
        },
        ul({ children }) {
          return <ul className="list-disc pl-4">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-4">{children}</ol>;
        },
        li({ children }) {
          return <li className="mb-1">{children}</li>;
        },
        table({ children }) {
          return (
            <div className="my-4 w-full overflow-y-auto">
              <table className="w-full">{children}</table>
            </div>
          );
        },
        thead({ children }) {
          return <thead className="border-b">{children}</thead>;
        },
        tr({ children }) {
          return <tr className="m-0 border-t p-0">{children}</tr>;
        },
        th({ children }) {
          return (
            <th className="border px-4 py-2 text-left font-bold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return <td className="border px-4 py-2 text-left">{children}</td>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
