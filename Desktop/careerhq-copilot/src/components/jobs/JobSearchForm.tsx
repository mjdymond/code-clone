'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import { JobSearchCriteria } from '@/types/agent';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ChevronRightIcon, PlusIcon, XIcon } from 'lucide-react';

// Validation schema
const searchFormSchema = z.object({
  role: z.string().min(2, 'Role is required'),
  location: z.string().optional(),
  experience: z.string().optional(),
  remote: z.boolean().default(false),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default('USD'),
  }).optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export function JobSearchForm() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const setAgentState = useStore(state => state.setAgentState);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      role: '',
      location: '',
      experience: '',
      remote: false,
      salary: {
        min: undefined,
        max: undefined,
        currency: 'USD',
      },
    },
  });

  const remoteValue = watch('remote');

  const handleAddSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const onSubmit = async (data: SearchFormValues) => {
    try {
      // Create search criteria
      const searchCriteria: JobSearchCriteria = {
        ...data,
        skills: skills,
      };

      // Update the job search agent state
      setAgentState('job_search_agent', {
        name: 'job_search_agent',
        status: 'thinking',
        completion_percentage: 0,
        current_task: 'Initiating job search',
        thinking: 'Starting job search for the provided criteria...',
        searchCriteria,
      });

      // Send request to API
      await api.searchJobs(searchCriteria);
    } catch (error) {
      console.error('Error starting job search:', error);
      
      // Update agent state to reflect error
      setAgentState('job_search_agent', {
        name: 'job_search_agent',
        status: 'error',
        completion_percentage: 0,
        error: 'Failed to start job search. Please try again.',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Find Matching Jobs</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
            <Input
              id="role"
              placeholder="e.g. Frontend Developer"
              {...register('role')}
            />
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. San Francisco, CA"
              {...register('location')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Input
              id="experience"
              placeholder="e.g. Entry-level, Mid-level, Senior"
              {...register('experience')}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="remote">Remote Work</Label>
              <Switch
                id="remote"
                checked={remoteValue}
                onCheckedChange={(checked) => {
                  // Using this pattern since the register function doesn't work well with Switch
                  const event = {
                    target: {
                      name: 'remote',
                      value: checked,
                    },
                  };
                  register('remote').onChange(event as any);
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex">
              <Input
                placeholder="Add a skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="ml-2"
                onClick={handleAddSkill}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-red-500"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary-min">Minimum Salary</Label>
              <Input
                id="salary-min"
                type="number"
                placeholder="e.g. 50000"
                {...register('salary.min', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary-max">Maximum Salary</Label>
              <Input
                id="salary-max"
                type="number"
                placeholder="e.g. 100000"
                {...register('salary.max', { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="ml-auto flex items-center">
            Find Matching Jobs
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
