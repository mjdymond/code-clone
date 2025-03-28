"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function DemoPage() {
  const demoItems = [
    {
      title: "Agent Showcase",
      description: "Combined agent visualization and interactive chat interface",
      href: "/demo/agent-showcase",
      color: "bg-gradient-to-br from-blue-500 to-purple-600",
    },
    {
      title: "Agent Visualization",
      description: "Enhanced agent visualization with animated connections",
      href: "/demo/agent-viz",
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      title: "Agent Connections",
      description: "Original agent connections visualization",
      href: "/demo/connections",
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
      title: "Agent Components",
      description: "Collection of agent UI components and interfaces",
      href: "/demo/agent-components",
      color: "bg-gradient-to-br from-pink-500 to-rose-600",
      isFeatured: true,
    },
  ];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Demo Showcase</h1>
      <p className="text-muted-foreground mb-8">
        Explore interactive demonstrations of CopilotKit agent-native UI components
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className={`group relative h-48 overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl ${item.isFeatured ? 'border-2 border-primary' : ''}`}>
              <div
                className={`absolute inset-0 ${item.color} opacity-90 transition-all duration-300 group-hover:opacity-100`}
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="opacity-90">{item.description}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm opacity-80">Explore Demo</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                {item.isFeatured && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs rounded-bl-md">
                    New
                  </div>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
