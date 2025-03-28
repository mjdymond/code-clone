import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, MessageSquare, DollarSign, ArrowRight, CpuIcon, Brain, Eye } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <div className="flex items-center mb-6">
          <CpuIcon className="h-12 w-12 mr-4 text-blue-600" />
          <h1 className="text-4xl font-bold">CareerHQ Copilot</h1>
        </div>
        <p className="text-xl max-w-2xl text-gray-600 mb-8">
          AI-powered career optimization with human guidance and transparent agent operations
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/resume">
            <Button size="lg" className="flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            <div>
              <CardTitle>Resume Optimization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get AI-powered resume analysis and improvements with ATS compatibility scoring and keyword matching.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0">
            <Briefcase className="h-6 w-6 mr-3 text-blue-600" />
            <div>
              <CardTitle>Job Search</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Find matching jobs with intelligent scoring based on your skills, experience, and preferences.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center space-y-0">
            <MessageSquare className="h-6 w-6 mr-3 text-blue-600" />
            <div>
              <CardTitle>Interview Preparation</CardTitle>
              <span className="text-xs bg-gray-100 text-gray-600 py-0.5 px-1.5 rounded mt-1 inline-block">
                Coming Soon
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Practice with AI-powered interview simulations and get feedback to improve your responses.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center space-y-0">
            <DollarSign className="h-6 w-6 mr-3 text-blue-600" />
            <div>
              <CardTitle>Salary Negotiation</CardTitle>
              <span className="text-xs bg-gray-100 text-gray-600 py-0.5 px-1.5 rounded mt-1 inline-block">
                Coming Soon
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get data-driven salary insights and negotiation strategies tailored to your role and location.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Agent-Native Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <Eye className="h-10 w-10 mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Full Transparency</h3>
            <p className="text-gray-600">
              See exactly what the AI agents are thinking and how they make decisions in real-time.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <Brain className="h-10 w-10 mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Human-in-the-Loop</h3>
            <p className="text-gray-600">
              Maintain control with approval workflows for all important decisions and changes.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <CpuIcon className="h-10 w-10 mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Task Tracking</h3>
            <p className="text-gray-600">
              Monitor progress with detailed task tracking and workflow visualization.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Ready to Optimize Your Career?</h2>
        <Link href="/resume">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
