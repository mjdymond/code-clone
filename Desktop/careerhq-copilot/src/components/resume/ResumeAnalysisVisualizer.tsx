'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AgentThinking } from "@/components/common/AgentThinking";
import { useCareerAgentRenderer } from "@/hooks/useCareerAgentRenderer";
import { useResumeAgentState } from "@/lib/store";
import { ResumeAgentState } from "@/types/agent";
import { BadgeCheck, BadgeX, CheckCircle, XCircle } from "lucide-react";

function StrengthsList({ strengths }: { strengths: ResumeAgentState['strengths'] }) {
  if (!strengths || strengths.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
        Strengths Identified
      </h3>
      <ul className="space-y-2">
        {strengths.map((strength, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm">{strength.text}</p>
              {strength.section && (
                <p className="text-xs text-gray-500 mt-0.5">Section: {strength.section}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WeaknessesList({ weaknesses }: { weaknesses: ResumeAgentState['weaknesses'] }) {
  if (!weaknesses || weaknesses.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <BadgeX className="h-4 w-4 mr-1 text-orange-500" />
        Areas for Improvement
      </h3>
      <ul className="space-y-3">
        {weaknesses.map((weakness, index) => (
          <li key={index} className="flex items-start">
            <XCircle className="h-4 w-4 mr-2 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm">{weakness.text}</p>
              {weakness.suggestion && (
                <p className="text-xs text-blue-600 mt-0.5">Suggestion: {weakness.suggestion}</p>
              )}
              {weakness.section && (
                <p className="text-xs text-gray-500 mt-0.5">Section: {weakness.section}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KeywordMatches({ keywordMatches }: { keywordMatches: ResumeAgentState['keywordMatches'] }) {
  if (!keywordMatches || keywordMatches.length === 0) {
    return null;
  }
  
  // Group by found/not found
  const foundKeywords = keywordMatches.filter(k => k.found);
  const missingKeywords = keywordMatches.filter(k => !k.found);
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Keyword Analysis</h3>
      
      <div className="space-y-3">
        {foundKeywords.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Found Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {foundKeywords.map((keyword, index) => (
                <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {keyword.keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {missingKeywords.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Missing Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <span key={index} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full flex items-center">
                  <XCircle className="h-3 w-3 mr-1" />
                  {keyword.keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ATSScore({ score }: { score?: number }) {
  if (score === undefined) {
    return null;
  }
  
  let color = 'bg-red-500';
  if (score >= 80) {
    color = 'bg-green-500';
  } else if (score >= 60) {
    color = 'bg-yellow-500';
  } else if (score >= 40) {
    color = 'bg-orange-500';
  }
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">ATS Compatibility Score</h3>
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2 z-10" 
          style={{ backgroundColor: color.replace('bg-', '') }}>
          {score}%
        </div>
        <Progress value={score} className="flex-grow" />
      </div>
    </div>
  );
}

export function ResumeAnalysisVisualizer() {
  const resumeAgentState = useResumeAgentState();
  
  // Use the custom renderer hook
  const renderedContent = useCareerAgentRenderer({
    name: 'resume_agent',
    render: ({ state }) => {
      const resumeState = state as ResumeAgentState;
      
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Resume Analysis</CardTitle>
          </CardHeader>
          
          <CardContent>
            {resumeState.status === 'thinking' && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Analysis Progress</span>
                  <span>{resumeState.completion_percentage}%</span>
                </div>
                <Progress value={resumeState.completion_percentage} />
                
                {resumeState.current_task && (
                  <p className="text-sm text-gray-600">{resumeState.current_task}</p>
                )}
                
                <AgentThinking 
                  agentName="Resume Agent" 
                  state={resumeState} 
                  title="Analysis in progress..."
                />
              </div>
            )}
            
            {resumeState.status === 'complete' && (
              <div className="space-y-4">
                <StrengthsList strengths={resumeState.strengths} />
                <WeaknessesList weaknesses={resumeState.weaknesses} />
                <KeywordMatches keywordMatches={resumeState.keywordMatches} />
                <ATSScore score={resumeState.atsScore} />
              </div>
            )}
            
            {resumeState.status === 'error' && (
              <div className="text-center py-4 text-red-500">
                <p className="text-sm">An error occurred during analysis:</p>
                <p className="text-sm font-medium">{resumeState.error}</p>
              </div>
            )}
            
            {resumeState.status === 'idle' && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Upload your resume to begin analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }
  });
  
  return renderedContent;
}
