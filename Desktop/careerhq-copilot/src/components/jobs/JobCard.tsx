"use client";

import { BuildingIcon, MapPinIcon, CalendarIcon, ExternalLinkIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_range: string;
  match_score: number;
  description: string;
  posted_date: string;
  url: string;
}

interface JobCardProps {
  job: JobData;
  onApply?: () => void;
  onViewDetails?: () => void;
}

export function JobCard({ job, onApply, onViewDetails }: JobCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-gray-500";
  };

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        {/* Match Score Badge */}
        <div className="absolute top-0 right-0 p-2">
          <div className="relative">
            <svg className="w-12 h-12" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-gray-200"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={`stroke-current ${getMatchScoreColor(job.match_score)}`}
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset={100 - job.match_score}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
              <text
                x="18"
                y="20"
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                className="font-bold"
              >
                {job.match_score}%
              </text>
            </svg>
          </div>
        </div>
        
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold leading-tight line-clamp-2 pr-10">{job.title}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <BuildingIcon className="mr-1 h-4 w-4" />
                <span>{job.company}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-y-2 text-sm text-gray-500">
              <div className="flex items-center mr-4">
                <MapPinIcon className="mr-1 h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center mr-4">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>{job.posted_date}</span>
              </div>
              <div className="font-medium text-gray-900">{job.salary_range}</div>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
            
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">Match Score:</span>
              <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${getMatchScoreColor(job.match_score)}`} 
                  style={{ width: `${job.match_score}%` }}
                />
              </div>
              <span className="ml-2">{job.match_score}%</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-2 pb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onViewDetails}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={onApply}
          >
            Apply Now
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
