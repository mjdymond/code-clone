# CareerHQ CopilotKit UI Integration Project Plan

## Project Overview

This project aims to integrate CopilotKit's UI framework with the CareerHQ Agent system to create a more interactive, transparent, and user-friendly interface. The integration will leverage CopilotKit's human-in-the-loop, agent state rendering, and bidirectional state sharing capabilities to enhance the CareerHQ experience.

## Architecture

### System Design

The system will follow a layered architecture:

1. **Frontend**: React/Next.js application using CopilotKit components
2. **Backend**: Python-based CareerHQ agent system with LangGraph workflow
3. **Communication**: Server-Sent Events (SSE) for streaming agent responses

### Key Components

1. **CopilotKit Integration Layer**:
   - Connects CopilotKit to CareerHQ backend
   - Manages agent state and workflow monitoring
   - Handles event streaming and state updates

2. **Agent Visualization Components**:
   - Shows real-time progress of resume analysis, job search, etc.
   - Visualizes agent thinking and reasoning steps
   - Displays task registry and completion status

3. **Human-in-the-Loop Controls**:
   - Implements approval interfaces for job applications
   - Provides feedback mechanisms for resume suggestions
   - Enables correction of agent misunderstandings

4. **Career-Specific Interfaces**:
   - Resume analysis visualization
   - Job search result presentation
   - Interview preparation interface
   - Salary negotiation assistant

## Implementation Plan

### Phase 1: Project Setup (Week 1)

1. **Initial Setup**:
   - Create Next.js project structure
   - Install CopilotKit dependencies
   - Configure development environment

2. **CareerHQ Backend API Integration**:
   - Modify server.py to support CopilotKit's requirements
   - Implement streaming API endpoints for agents
   - Add state exposure for agent progress

3. **Basic Chat Interface**:
   - Implement CareerHQ-themed chat UI
   - Connect to modified CareerHQ API
   - Test basic message handling

### Phase 2: Core State Management (Week 1-2)

1. **Implement Task Tracking**:
   ```jsx
   // hooks/useCareerTaskRegistry.ts
   import { useState, useEffect } from "react";
   import { useCoAgent } from "@copilotkit/react-core";
   
   export function useCareerTaskRegistry() {
     const { state, setState } = useCoAgent({
       name: "task_registry",
       initialState: {
         tasks: [],
         completedTasks: [],
         overall_completion: 0
       }
     });
     
     const updateTaskStatus = (taskName, status) => {
       setState(prevState => {
         const tasks = [...prevState.tasks];
         const taskIndex = tasks.findIndex(t => t.name === taskName);
         
         if (taskIndex !== -1) {
           tasks[taskIndex] = {
             ...tasks[taskIndex],
             status: status,
             completedAt: status === 'completed' ? new Date().toISOString() : null
           };
         }
         
         return {
           ...prevState,
           tasks
         };
       });
     };
     
     return { 
       tasks: state.tasks,
       completedTasks: state.completedTasks,
       overall_completion: state.overall_completion,
       updateTaskStatus
     };
   }
   ```

2. **Agent State Monitoring**:
   ```jsx
   // hooks/useAgentProgress.ts
   import { useCoAgent } from "@copilotkit/react-core";
   
   export function useAgentProgress(agentName) {
     const { state, setState } = useCoAgent({
       name: `${agentName}_progress`,
       initialState: { 
         completion_status: 0,
         contributions: [],
         last_updated: null
       }
     });
     
     const updateProgress = (completion, contribution) => {
       setState(prevState => ({
         ...prevState,
         completion_status: completion,
         contributions: [...prevState.contributions, contribution],
         last_updated: new Date().toISOString()
       }));
     };
     
     return {
       progress: state,
       updateProgress
     };
   }
   ```

3. **Adapt CareerHQ Backend**:
   - Modify the supervisor_node to emit progress updates
   - Enhance the reporter_node to provide completion signals
   - Update workflow_service to track task status

### Phase 3: Specialized Agent Components (Week 2)

1. **Resume Agent Interface**:
   ```jsx
   // components/resume/ResumeAnalysisVisualizer.tsx
   import { useCoAgentStateRender } from "@copilotkit/react-core";
   
   export function ResumeAnalysisVisualizer() {
     useCoAgentStateRender({
       name: "resume_agent",
       render: ({ state }) => (
         <div className="resume-analysis">
           <h3 className="text-lg font-semibold">Resume Analysis Progress</h3>
           
           {state.analyzing && (
             <div className="resume-analysis-progress">
               <ProgressBar value={state.completion_status} />
               <p className="text-sm text-gray-600">
                 {state.currentAction || "Analyzing resume..."}
               </p>
             </div>
           )}
           
           {state.strengths && (
             <div className="resume-strengths mt-4">
               <h4 className="font-medium">Strengths Identified</h4>
               <ul className="list-disc pl-5 mt-2">
                 {state.strengths.map((strength, i) => (
                   <li key={i}>{strength}</li>
                 ))}
               </ul>
             </div>
           )}
           
           {state.improvements && (
             <div className="resume-improvements mt-4">
               <h4 className="font-medium">Suggested Improvements</h4>
               <ul className="list-disc pl-5 mt-2">
                 {state.improvements.map((improvement, i) => (
                   <li key={i}>{improvement}</li>
                 ))}
               </ul>
             </div>
           )}
         </div>
       )
     });
     
     return null;
   }
   ```

2. **Job Search Visualization**:
   ```jsx
   // components/jobs/JobSearchVisualizer.tsx
   import { useCoAgentStateRender } from "@copilotkit/react-core";
   
   export function JobSearchVisualizer() {
     useCoAgentStateRender({
       name: "job_search_agent",
       render: ({ state }) => (
         <div className="job-search-progress">
           <h3 className="text-lg font-semibold">Job Search Progress</h3>
           
           {state.searching && (
             <div className="search-status">
               <LinearProgress variant="determinate" value={state.completion_status} />
               <p className="text-sm text-gray-600 mt-2">
                 {state.currentAction || "Searching for matching jobs..."}
               </p>
             </div>
           )}
           
           {state.results && state.results.length > 0 && (
             <div className="job-results mt-4">
               <h4 className="font-medium">Top Matches</h4>
               <div className="job-cards grid gap-4 mt-2">
                 {state.results.slice(0, 3).map((job, i) => (
                   <JobCard key={i} job={job} />
                 ))}
               </div>
             </div>
           )}
         </div>
       )
     });
     
     return null;
   }
   ```

3. **Interview Preparation Component**:
   - Create interface for interview question practice
   - Implement feedback visualization for responses
   - Show suggested improvements in real-time

### Phase 4: Human-in-the-Loop Features (Week 2-3)

1. **Resume Improvement Approval**:
   ```jsx
   // components/resume/ResumeImprovementApproval.tsx
   import { useCopilotAction } from "@copilotkit/react-core";
   
   export function ResumeImprovementApproval() {
     useCopilotAction({
       name: "ApproveResumeChanges",
       parameters: [
         { name: "original", type: "string" },
         { name: "improved", type: "string" },
         { name: "changes", type: "array" }
       ],
       renderAndWait: ({ args, handler }) => (
         <div className="resume-approval p-4 border rounded-lg bg-white shadow-sm">
           <h3 className="text-xl font-bold mb-4">Review Suggested Improvements</h3>
           
           <div className="changes-summary mb-4">
             <h4 className="font-semibold">Summary of Changes</h4>
             <ul className="list-disc pl-5 mt-2">
               {args.changes.map((change, i) => (
                 <li key={i} className="text-sm">
                   {change.description}
                 </li>
               ))}
             </ul>
           </div>
           
           <div className="resume-diff mb-6">
             <h4 className="font-semibold mb-2">Before / After</h4>
             <DiffViewer
               original={args.original}
               modified={args.improved}
               splitView={true}
             />
           </div>
           
           <div className="action-buttons flex gap-3 justify-end">
             <button 
               onClick={() => handler({ approved: false })}
               className="px-4 py-2 border rounded text-gray-700"
             >
               Reject Changes
             </button>
             <button 
               onClick={() => handler({ approved: true })}
               className="px-4 py-2 bg-blue-600 text-white rounded"
             >
               Apply Improvements
             </button>
           </div>
         </div>
       )
     });
     
     return null;
   }
   ```

2. **Job Application Confirmation**:
   - Create interface for reviewing job applications
   - Implement customization of cover letters
   - Add confirmation step before submission

3. **Salary Negotiation Assistance**:
   - Develop step-by-step guidance interface
   - Implement suggestion approval mechanism
   - Create real-time coaching during negotiation

### Phase 5: Workflow Efficiency Enhancements (Week 3)

1. **Circular Delegation Detection**:
   - Implement UI feedback for detected agent loops
   - Create intervention interface for redirecting agents
   - Show workflow efficiency metrics

2. **Task Progress Tracking**:
   ```jsx
   // components/workflow/TaskTracker.tsx
   import { useCoAgentStateRender } from "@copilotkit/react-core";
   
   export function TaskTracker() {
     useCoAgentStateRender({
       name: "task_registry",
       render: ({ state }) => (
         <div className="task-tracker p-4 border rounded-lg">
           <h3 className="text-lg font-semibold mb-3">Workflow Progress</h3>
           
           <div className="overall-progress mb-4">
             <div className="flex justify-between text-sm mb-1">
               <span>Overall Completion</span>
               <span>{state.overall_completion}%</span>
             </div>
             <ProgressBar value={state.overall_completion} />
           </div>
           
           <div className="task-list space-y-3">
             {state.tasks.map((task) => (
               <div key={task.name} className="task-item">
                 <div className="flex items-center">
                   <StatusIcon status={task.status} />
                   <span className="ml-2 flex-grow">{task.name}</span>
                   <span className="text-xs text-gray-500">
                     {task.assigned_to}
                   </span>
                 </div>
                 {task.status === 'in_progress' && (
                   <LinearProgress 
                     className="mt-1" 
                     variant="indeterminate" 
                     size="sm" 
                   />
                 )}
               </div>
             ))}
           </div>
         </div>
       )
     });
     
     return null;
   }
   ```

3. **Agent Interaction Network**:
   - Visualize communication between agents
   - Show information flow and dependencies
   - Highlight bottlenecks in the workflow

### Phase 6: Integration and Testing (Week 3-4)

1. **Full System Integration**:
   - Connect all CopilotKit components to CareerHQ backend
   - Implement seamless state synchronization
   - Test end-to-end workflows

2. **User Experience Testing**:
   - Conduct usability testing sessions
   - Gather feedback on agent interactions
   - Measure workflow efficiency improvements

3. **Performance Optimization**:
   - Implement efficient state management
   - Optimize rendering for complex visualizations
   - Ensure responsive experience on various devices

## Deployment and Launch

1. **Documentation**:
   - Create developer documentation for the integration
   - Write user guides for new features
   - Document APIs and component interfaces

2. **Deployment**:
   - Configure production environment
   - Set up continuous integration pipeline
   - Deploy to staging for final testing

3. **Launch**:
   - Release the enhanced CareerHQ interface
   - Monitor initial usage and performance
   - Gather user feedback for future improvements

## Expected Outcomes

1. **Enhanced User Experience**:
   - More transparent agent operations
   - Intuitive interaction with AI systems
   - Better user engagement and trust

2. **Improved Workflow Efficiency**:
   - Reduced recursion and API calls
   - Faster completion of complex tasks
   - More accurate and relevant results

3. **Increased User Control**:
   - Human oversight for critical decisions
   - Ability to correct agent misunderstandings
   - Collaborative problem-solving approach

## Future Extensions

1. **Agent Steering Controls**:
   - Advanced redirection of agent focus
   - User-directed priority adjustment
   - Guided exploration of alternatives

2. **Multi-Modal Interactions**:
   - Voice interface for agent interaction
   - Document scanning and analysis
   - Visual feedback for complex concepts

3. **Personalized Agent Behaviors**:
   - User preference learning
   - Customizable agent personalities
   - Adaptive workflow suggestions
