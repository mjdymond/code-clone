'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCareerApproval } from "@/hooks/useCareerApproval";
import { JobApplicationApprovalData } from "@/types/agent";
import { CheckCircle, XCircle, FileText, Briefcase, Mail, Phone } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function JobApplicationApproval() {
  const [feedback, setFeedback] = useState('');
  
  const approvalComponent = useCareerApproval({
    name: 'JobApplicationApproval',
    type: 'job_application',
    renderAndWait: ({ args, handler }) => {
      const { job, coverLetter, resume, applicationDetails } = args;
      
      const handleApproval = (approved: boolean) => {
        handler({ approved, feedback: feedback || undefined });
      };
      
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Review Job Application</CardTitle>
            <p className="text-sm text-gray-500">
              Please review your application to {job.company} for the {job.title} position
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="job-summary border rounded-md p-4 bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-600">{job.location}{job.remote ? ' (Remote)' : ''}</p>
                </div>
                <div className="flex items-center text-sm">
                  <Badge variant="secondary" className="flex items-center">
                    {job.matchScore}% match
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="application-details space-y-3">
              <h3 className="text-sm font-medium">Application Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span>{applicationDetails.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Name:</span>
                  <span>{applicationDetails.name}</span>
                </div>
                {applicationDetails.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <span>{applicationDetails.phone}</span>
                  </div>
                )}
              </div>
              
              {applicationDetails.additionalQuestions && 
                Object.keys(applicationDetails.additionalQuestions).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Application Questions</h4>
                  <div className="space-y-3">
                    {Object.entries(applicationDetails.additionalQuestions).map(([question, answer], index) => (
                      <div key={index} className="border rounded p-3">
                        <p className="text-sm font-medium">{question}</p>
                        <p className="text-sm mt-1">{answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="application-content">
              <Tabs defaultValue="cover-letter">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="cover-letter" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Cover Letter
                  </TabsTrigger>
                  <TabsTrigger value="resume" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Resume
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="cover-letter" className="mt-4">
                  <div className="border rounded-md p-4">
                    <div className="text-sm whitespace-pre-wrap">{coverLetter}</div>
                  </div>
                </TabsContent>
                
                <TabsContent value="resume" className="mt-4">
                  <div className="border rounded-md p-4">
                    <div className="text-sm whitespace-pre-wrap">{resume}</div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Feedback (Optional)</h3>
              <Textarea
                placeholder="Provide feedback on this application..."
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
              Cancel Application
            </Button>
            <Button 
              onClick={() => handleApproval(true)}
              className="flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          </CardFooter>
        </Card>
      );
    }
  });
  
  return approvalComponent;
}
