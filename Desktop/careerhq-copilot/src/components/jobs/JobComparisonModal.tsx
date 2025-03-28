'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { JobListing } from "@/types/agent";
import { ChevronRight, CheckCircle, XCircle, Award, Star } from "lucide-react";

export function JobComparisonModal() {
  const comparedJobs = useStore(state => state.comparedJobs);
  const removeComparedJob = useStore(state => state.removeComparedJob);
  const clearComparedJobs = useStore(state => state.clearComparedJobs);
  
  if (comparedJobs.length === 0) {
    return null;
  }
  
  // Helper function to determine what color to use for a match value
  const getMatchColor = (value: number) => {
    if (value >= 90) return "text-green-600";
    if (value >= 75) return "text-blue-600";
    if (value >= 60) return "text-yellow-600";
    return "text-gray-600";
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-4 right-4 shadow-md z-10"
        >
          Compare Jobs ({comparedJobs.length})
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Compare Jobs</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 w-1/4">Criteria</th>
                {comparedJobs.map(job => (
                  <th key={job.id} className="text-left p-2 relative">
                    <div className="pr-8">
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="mt-1">
                        <Badge className="flex items-center w-fit">
                          <Star className="h-3 w-3 mr-1" />
                          {job.matchScore}%
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => removeComparedJob(job.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-medium">Location</td>
                {comparedJobs.map(job => (
                  <td key={job.id} className="p-2">
                    <p className="text-sm">{job.location}</p>
                    {job.remote && (
                      <Badge variant="outline" className="mt-1 text-xs">Remote</Badge>
                    )}
                  </td>
                ))}
              </tr>
              
              <tr className="border-b">
                <td className="p-2 font-medium">Salary</td>
                {comparedJobs.map(job => (
                  <td key={job.id} className="p-2">
                    {job.salary_range ? (
                      <p className="text-sm">
                        {job.salary_range.currency} {job.salary_range.min.toLocaleString()} - {job.salary_range.max.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Not specified</p>
                    )}
                  </td>
                ))}
              </tr>
              
              <tr className="border-b">
                <td className="p-2 font-medium">Posted Date</td>
                {comparedJobs.map(job => (
                  <td key={job.id} className="p-2">
                    <p className="text-sm">{new Date(job.postedDate).toLocaleDateString()}</p>
                  </td>
                ))}
              </tr>
              
              <tr className="border-b">
                <td className="p-2 font-medium">Match Details</td>
                {comparedJobs.map(job => (
                  <td key={job.id} className="p-2">
                    {job.matchDetails ? (
                      <div className="space-y-1">
                        <p className={`text-sm flex items-center ${getMatchColor(job.matchDetails.roleMatch)}`}>
                          <span className="w-24">Role:</span>
                          <span>{job.matchDetails.roleMatch}%</span>
                        </p>
                        <p className={`text-sm flex items-center ${getMatchColor(job.matchDetails.skillsMatch)}`}>
                          <span className="w-24">Skills:</span>
                          <span>{job.matchDetails.skillsMatch}%</span>
                        </p>
                        <p className={`text-sm flex items-center ${getMatchColor(job.matchDetails.experienceMatch)}`}>
                          <span className="w-24">Experience:</span>
                          <span>{job.matchDetails.experienceMatch}%</span>
                        </p>
                        <p className={`text-sm flex items-center ${getMatchColor(job.matchDetails.locationMatch)}`}>
                          <span className="w-24">Location:</span>
                          <span>{job.matchDetails.locationMatch}%</span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No details available</p>
                    )}
                  </td>
                ))}
              </tr>
              
              <tr className="border-b">
                <td className="p-2 font-medium">Requirements Summary</td>
                {comparedJobs.map(job => (
                  <td key={job.id} className="p-2">
                    <p className="text-sm">
                      {job.requirementsSummary || "Not specified"}
                    </p>
                  </td>
                ))}
              </tr>
              
              <tr>
                <td className="p-2 font-medium">Actions</td>
                {comparedJobs.map(job => (
                  <td key={job.id} className="p-2">
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        View Details
                      </Button>
                      <Button size="sm" className="w-full text-xs">
                        Apply Now
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button variant="ghost" size="sm" onClick={clearComparedJobs}>
            Clear All
          </Button>
          <Badge className="flex items-center">
            <Award className="h-3 w-3 mr-1" />
            Best Match: {comparedJobs.length > 0 
              ? comparedJobs.reduce((best, job) => job.matchScore > best.matchScore ? job : best, comparedJobs[0]).company 
              : 'None'}
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
