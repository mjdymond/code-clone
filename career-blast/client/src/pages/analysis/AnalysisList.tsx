import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Loader2, AlertCircle, Plus, FileText, Briefcase, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { AnalysisService } from '../../services/analysis.service';
import { useAuth } from '../../context/AuthContext';
import type { Analysis } from '@shared/types/supabase';

export default function AnalysisList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      loadAnalyses();
    }
  }, [user]);
  
  const loadAnalyses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { analyses, error } = await AnalysisService.getUserAnalyses(user.id);
      
      if (error) {
        throw error;
      }
      
      setAnalyses(analyses);
    } catch (error) {
      console.error('Error loading analyses:', error);
      setError('Failed to load analyses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get status badge class based on analysis status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume Analyses</h1>
        <Button onClick={() => navigate('/analysis/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Analysis
        </Button>
      </div>
      
      {error && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {analyses.length === 0 && !error ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No analyses found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first resume analysis to get started.
              </p>
              <Button onClick={() => navigate('/analysis/new')}>
                <Plus className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/analysis/${analysis.id}`)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div>
                        <h3 className="font-medium">
                          {analysis.resume?.title || 'Unnamed Resume'} → {analysis.job?.title || 'Unnamed Job'}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          <span>{analysis.resume?.title || 'Unnamed Resume'}</span>
                          <span className="mx-1">•</span>
                          <Briefcase className="h-3.5 w-3.5 mr-1" />
                          <span>{analysis.job?.company || 'Unknown Company'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(analysis.status)}`}>
                      {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                    </span>
                    {analysis.match_score !== null && (
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {Math.round(analysis.match_score)}% Match
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 inline mr-1" />
                  Created on {formatDate(analysis.created_at)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
