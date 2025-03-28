"use client";

import React, { forwardRef, useRef } from "react";
import { 
  FileText, 
  Briefcase, 
  Cpu, 
  UserCircle, 
  FileSearch, 
  GraduationCap, 
  Brain
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Card } from "@/components/ui/card";

const AgentNode = forwardRef<
  HTMLDivElement,
  { 
    className?: string; 
    children?: React.ReactNode;
    label: string;
    primary?: boolean;
  }
>(({ className, children, label, primary = false }, ref) => {
  return (
    <div className="flex flex-col items-center">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-16 items-center justify-center rounded-full p-4 shadow-lg",
          primary 
            ? "bg-blue-600 text-white" 
            : "bg-white border-2 border-blue-100 text-blue-800",
          className,
        )}
      >
        {children}
      </div>
      <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
});

AgentNode.displayName = "AgentNode";

export function AgentConnectionsDemo() {
  // Container reference
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Agent nodes
  const coordinatorRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);
  const interviewRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const researchRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 border-blue-100">
      <div
        className="relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10"
        ref={containerRef}
      >
        <div className="flex size-full flex-col max-w-3xl items-stretch">
          {/* User Node (Center) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <AgentNode ref={userRef} label="User" primary>
              <UserCircle size={28} />
            </AgentNode>
          </div>
          
          {/* Coordinator Node (Top) */}
          <div className="absolute left-1/2 top-[100px] transform -translate-x-1/2">
            <AgentNode ref={coordinatorRef} label="CareerHQ Coordinator" primary>
              <Brain size={28} />
            </AgentNode>
          </div>
          
          {/* Agent Nodes */}
          <div className="absolute left-[15%] top-1/2 transform -translate-y-1/2">
            <AgentNode ref={resumeRef} label="Resume Agent">
              <FileText size={24} />
            </AgentNode>
          </div>
          
          <div className="absolute right-[15%] top-1/2 transform -translate-y-1/2">
            <AgentNode ref={jobsRef} label="Job Search Agent">
              <Briefcase size={24} />
            </AgentNode>
          </div>
          
          <div className="absolute left-[30%] bottom-[100px]">
            <AgentNode ref={interviewRef} label="Interview Agent">
              <Cpu size={24} />
            </AgentNode>
          </div>
          
          <div className="absolute right-[30%] bottom-[100px]">
            <AgentNode ref={researchRef} label="Market Research">
              <FileSearch size={24} />
            </AgentNode>
          </div>
          
          <div className="absolute left-1/2 bottom-[100px] transform -translate-x-1/2">
            <AgentNode ref={educationRef} label="Education Agent">
              <GraduationCap size={24} />
            </AgentNode>
          </div>
        </div>

        {/* Animated Beams */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={coordinatorRef}
          toRef={userRef}
          curvature={-50}
          gradientStartColor="#4285F4"
          gradientStopColor="#34A853"
          pathColor="#E1EFFE"
        />
        
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={resumeRef}
          toRef={coordinatorRef}
          curvature={-30}
          pathColor="#E1EFFE"
          gradientStartColor="#FBBC05" 
          gradientStopColor="#4285F4"
        />
        
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={jobsRef}
          toRef={coordinatorRef}
          curvature={-30}
          pathColor="#E1EFFE" 
          gradientStartColor="#34A853"
          gradientStopColor="#4285F4"
        />
        
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={interviewRef}
          toRef={coordinatorRef}
          curvature={50}
          pathColor="#E1EFFE"
          gradientStartColor="#EA4335"
          gradientStopColor="#4285F4" 
        />
        
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={researchRef}
          toRef={coordinatorRef}
          curvature={50}
          pathColor="#E1EFFE"
          gradientStartColor="#4285F4"
          gradientStopColor="#FBBC05"
        />
        
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={educationRef}
          toRef={coordinatorRef}
          curvature={50}
          pathColor="#E1EFFE"
          gradientStartColor="#34A853"
          gradientStopColor="#EA4335"
        />
        
        {/* Direct connections to user */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={resumeRef}
          toRef={userRef}
          reverse
          pathColor="#E1EFFE"
          pathOpacity={0.1}
          gradientStartColor="#FBBC05"
          gradientStopColor="#34A853"
        />
        
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={jobsRef}
          toRef={userRef}
          reverse
          pathColor="#E1EFFE"
          pathOpacity={0.1}
          gradientStartColor="#34A853"
          gradientStopColor="#EA4335"
        />
      </div>
      
      <div className="p-4 text-center bg-white border-t border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800">CareerHQ Agent Network</h3>
        <p className="text-sm text-gray-600 mt-1">
          Real-time bidirectional communication between specialized agents and human user
        </p>
      </div>
    </Card>
  );
}
