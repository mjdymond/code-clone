'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useCareerApproval } from "@/hooks/useCareerApproval";
import { ResumeApprovalData } from "@/types/agent";
import { CheckCircle, XCircle, ArrowRightIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  const colors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${colors[impact]}`}>
      {impact}
    </span>
  );
}

export function ResumeImprovementApproval() {
  const [feedback, setFeedback] = useState('');
  
  const approvalComponent = useCareerApproval({
    name: 'ResumeImprovementApproval',
    type: 'resume_improvements',
    renderAndWait: ({ args, handler }) => {
      const { improvements, originalResume, improvedResume } = args;
      
      const handleApproval = (approved: boolean) => {
        handler({ approved, feedback: feedback || undefined });
      };
      
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Review Resume Improvements</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Suggested Improvements</h3>
              <div className="space-y-3">
                {improvements.map((improvement, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium">{improvement.section}</h4>
                      <ImpactBadge impact={improvement.impact} />
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{improvement.reason}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="border p-2 rounded bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Original</p>
                        <p className="text-sm">{improvement.originalText}</p>
                      </div>
                      <div className="border p-2 rounded bg-blue-50">
                        <p className="text-xs text-gray-500 mb-1">Improved</p>
                        <p className="text-sm">{improvement.improvedText}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Full Resume Comparison</h3>
              <Tabs defaultValue="split">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="split">Side by Side</TabsTrigger>
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="improved">Improved</TabsTrigger>
                </TabsList>
                
                <TabsContent value="split" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded p-3 bg-gray-50">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">Original Resume</h4>
                      <div className="text-sm whitespace-pre-wrap">{originalResume}</div>
                    </div>
                    <div className="border rounded p-3 bg-blue-50">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">Improved Resume</h4>
                      <div className="text-sm whitespace-pre-wrap">{improvedResume}</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="original" className="mt-4">
                  <div className="border rounded p-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Original Resume</h4>
                    <div className="text-sm whitespace-pre-wrap">{originalResume}</div>
                  </div>
                </TabsContent>
                
                <TabsContent value="improved" className="mt-4">
                  <div className="border rounded p-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Improved Resume</h4>
                    <div className="text-sm whitespace-pre-wrap">{improvedResume}</div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Feedback (Optional)</h3>
              <Textarea
                placeholder="Provide feedback on these suggestions..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => handleApproval(false)}
              className="flex items-center"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Changes
            </Button>
            <Button 
              onClick={() => handleApproval(true)}
              className="flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Apply Improvements
            </Button>
          </CardFooter>
        </Card>
      );
    }
  });
  
  return approvalComponent;
}
