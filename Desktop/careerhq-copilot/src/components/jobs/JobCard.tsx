'use client';

import { JobListing } from '@/types/agent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, DollarSign, Calendar, Building, ArrowRight, Plus, Check } from 'lucide-react';
import { useStore } from '@/lib/store';

interface JobCardProps {
  job: JobListing;
  showCompareButton?: boolean;
  isCompared?: boolean;
  onCompare?: (job: JobListing) => void;
  onViewDetails?: (job: JobListing) => void;
  onApply?: (job: JobListing) => void;
}

export function JobCard({
  job,
  showCompareButton = true,
  isCompared = false,
  onCompare,
  onViewDetails,
  onApply,
}: JobCardProps) {
  const selectedJob = useStore(state => state.selectedJob);
  const setSelectedJob = useStore(state => state.setSelectedJob);
  
  // Calculate match level for UI visualization
  const getMatchLevel = (score: number) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'low';
  };
  
  const matchLevel = getMatchLevel(job.matchScore);
  
  // Match color based on score
  const matchColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    fair: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-gray-800',
  };
  
  // Format date
  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(job);
    } else {
      setSelectedJob(job);
    }
  };
  
  const handleApply = () => {
    if (onApply) {
      onApply(job);
    } else {
      // Default implementation if no callback provided
      setSelectedJob(job);
      // TODO: Open job application modal/workflow
    }
  };
  
  const handleCompare = () => {
    if (onCompare) {
      onCompare(job);
    }
  };
  
  return (
    <Card className="job-card w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Building className="h-3.5 w-3.5 mr-1" />
              <span>{job.company}</span>
            </div>
          </div>
          <div className={`flex items-center text-sm ${matchColors[matchLevel]} px-2 py-1 rounded`}>
            <Star className="w-4 h-4 mr-1" />
            <span>{job.matchScore}% match</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
            <span>{job.location}{job.remote && ' (Remote)'}</span>
          </div>
          
          {job.salary_range && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span>
                {job.salary_range.currency} {job.salary_range.min.toLocaleString()} - {job.salary_range.max.toLocaleString()}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
            <span>Posted {formatPostedDate(job.postedDate)}</span>
          </div>
          
          {job.matchDetails && (
            <div className="flex flex-wrap gap-1 pt-1">
              {job.matchDetails.roleMatch > 75 && (
                <Badge variant="secondary" className="text-xs">
                  Role: {job.matchDetails.roleMatch}%
                </Badge>
              )}
              {job.matchDetails.skillsMatch > 75 && (
                <Badge variant="secondary" className="text-xs">
                  Skills: {job.matchDetails.skillsMatch}%
                </Badge>
              )}
              {job.matchDetails.locationMatch > 75 && (
                <Badge variant="secondary" className="text-xs">
                  Location: {job.matchDetails.locationMatch}%
                </Badge>
              )}
            </div>
          )}
          
          <p className="text-sm mt-2 line-clamp-3">{job.description}</p>
          
          <div className="pt-2 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handleViewDetails}>
                View Details
              </Button>
              <Button size="sm" onClick={handleApply} className="flex items-center">
                Apply
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            
            {showCompareButton && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCompare}
                disabled={isCompared}
                className="text-xs"
              >
                {isCompared ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    In Compare
                  </>
                ) : (
                  <>
                    <Plus className="mr-1 h-3 w-3" />
                    Compare
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
