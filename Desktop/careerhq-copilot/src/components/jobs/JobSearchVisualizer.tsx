'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgentThinking } from "@/components/common/AgentThinking";
import { useCareerAgentRenderer } from "@/hooks/useCareerAgentRenderer";
import { useStore } from "@/lib/store";
import { JobSearchAgentState } from "@/types/agent";
import { JobCard } from "./JobCard";
import { FilterIcon, ArrowDownNarrowWide } from "lucide-react";
import { useState } from "react";

enum SortOrder {
  MATCH_DESC = "match_desc",
  POSTED_DESC = "posted_desc",
  SALARY_DESC = "salary_desc",
  SALARY_ASC = "salary_asc",
}

export function JobSearchVisualizer() {
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.MATCH_DESC);
  const addComparedJob = useStore(state => state.addComparedJob);
  const comparedJobs = useStore(state => state.comparedJobs);
  const setSelectedJob = useStore(state => state.setSelectedJob);
  const jobSearchAgentState = useStore(state => (state.agents.job_search_agent || {}) as JobSearchAgentState);
  
  // Use the custom renderer hook
  const renderedContent = useCareerAgentRenderer({
    name: 'job_search_agent',
    render: ({ state }) => {
      const jobSearchState = state as JobSearchAgentState;
      
      // Sort jobs based on selected order
      const sortedJobs = jobSearchState.results ? [...jobSearchState.results].sort((a, b) => {
        switch (sortOrder) {
          case SortOrder.MATCH_DESC:
            return b.matchScore - a.matchScore;
          case SortOrder.POSTED_DESC:
            return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
          case SortOrder.SALARY_DESC:
            const aMax = a.salary_range?.max || 0;
            const bMax = b.salary_range?.max || 0;
            return bMax - aMax;
          case SortOrder.SALARY_ASC:
            const aMin = a.salary_range?.min || 0;
            const bMin = b.salary_range?.min || 0;
            return aMin - bMin;
          default:
            return 0;
        }
      }) : [];
      
      const handleCompare = (job) => {
        addComparedJob(job);
      };
      
      const handleViewDetails = (job) => {
        setSelectedJob(job);
        // In a real implementation, this would navigate to a job details page or open a modal
      };
      
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Job Search Results</CardTitle>
          </CardHeader>
          
          <CardContent>
            {jobSearchState.searchCriteria && (
              <div className="search-criteria mb-4 p-3 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium mb-2">Search Criteria</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {jobSearchState.searchCriteria.role && (
                    <div className="flex">
                      <span className="font-medium w-24">Role:</span>
                      <span>{jobSearchState.searchCriteria.role}</span>
                    </div>
                  )}
                  {jobSearchState.searchCriteria.location && (
                    <div className="flex">
                      <span className="font-medium w-24">Location:</span>
                      <span>{jobSearchState.searchCriteria.location}</span>
                    </div>
                  )}
                  {jobSearchState.searchCriteria.experience && (
                    <div className="flex">
                      <span className="font-medium w-24">Experience:</span>
                      <span>{jobSearchState.searchCriteria.experience}</span>
                    </div>
                  )}
                  {jobSearchState.searchCriteria.remote !== undefined && (
                    <div className="flex">
                      <span className="font-medium w-24">Remote:</span>
                      <span>{jobSearchState.searchCriteria.remote ? 'Yes' : 'No'}</span>
                    </div>
                  )}
                </div>
                {jobSearchState.searchCriteria.skills && jobSearchState.searchCriteria.skills.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">Skills: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {jobSearchState.searchCriteria.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {jobSearchState.status === 'thinking' && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Search Progress</span>
                  <span>{jobSearchState.completion_percentage}%</span>
                </div>
                <Progress value={jobSearchState.completion_percentage} />
                
                {jobSearchState.current_task && (
                  <p className="text-sm text-gray-600">{jobSearchState.current_task}</p>
                )}
                
                <AgentThinking 
                  agentName="Job Search Agent" 
                  state={jobSearchState} 
                  title="Finding matching jobs..."
                />
              </div>
            )}
            
            {jobSearchState.status === 'complete' && jobSearchState.results && (
              <div className="space-y-4">
                {jobSearchState.results.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {jobSearchState.results.length} matching jobs found
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-xs flex items-center">
                          <FilterIcon className="h-3 w-3 mr-1" />
                          Filter
                        </Button>
                        <div className="relative">
                          <Button variant="ghost" size="sm" className="text-xs flex items-center">
                            <ArrowDownNarrowWide className="h-3 w-3 mr-1" />
                            Sort
                          </Button>
                          <div className="hidden absolute right-0 mt-1 bg-white border rounded-md p-1 shadow-md z-10 w-48">
                            <button
                              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                              onClick={() => setSortOrder(SortOrder.MATCH_DESC)}
                            >
                              Best Match
                            </button>
                            <button
                              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                              onClick={() => setSortOrder(SortOrder.POSTED_DESC)}
                            >
                              Most Recent
                            </button>
                            <button
                              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                              onClick={() => setSortOrder(SortOrder.SALARY_DESC)}
                            >
                              Highest Salary
                            </button>
                            <button
                              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                              onClick={() => setSortOrder(SortOrder.SALARY_ASC)}
                            >
                              Lowest Salary
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="job-cards space-y-4">
                      {sortedJobs.map((job) => (
                        <JobCard 
                          key={job.id} 
                          job={job} 
                          isCompared={comparedJobs.some(j => j.id === job.id)}
                          onCompare={handleCompare}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No matching jobs found. Try adjusting your search criteria.</p>
                  </div>
                )}
              </div>
            )}
            
            {jobSearchState.status === 'error' && (
              <div className="text-center py-4 text-red-500">
                <p className="text-sm">An error occurred during job search:</p>
                <p className="text-sm font-medium">{jobSearchState.error}</p>
              </div>
            )}
            
            {jobSearchState.status === 'idle' && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Enter search criteria to find matching jobs</p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }
  });
  
  return renderedContent;
}
