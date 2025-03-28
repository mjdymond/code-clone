import { useCoAgentStateRender } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { CheckCircle, Clock, AlertCircle, PlayCircle } from "lucide-react";

interface Task {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assigned_to: string;
  created_at: string;
  completed_at: string | null;
  description?: string;
}

interface TaskRegistryState {
  tasks: Task[];
  completedTasks: Task[];
  overall_completion: number;
}

function StatusIcon({ status }: { status: Task['status'] }) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'in_progress':
      return <PlayCircle className="w-4 h-4 text-blue-500" />;
    case 'blocked':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'pending':
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
}

export function TaskTracker() {
  useCoAgentStateRender({
    name: "task_registry",
    render: ({ state }: { state: TaskRegistryState }) => (
      <Card className="task-tracker w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Workflow Progress</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="overall-progress mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Completion</span>
              <span>{state.overall_completion}%</span>
            </div>
            <Progress value={state.overall_completion} />
          </div>
          
          <div className="task-list space-y-3 mt-4">
            {state.tasks.map((task) => (
              <div key={task.name} className="task-item">
                <div className="flex items-center">
                  <StatusIcon status={task.status} />
                  <span className="ml-2 flex-grow text-sm">{task.name}</span>
                  <span className="text-xs text-gray-500">
                    {task.assigned_to}
                  </span>
                </div>
                {task.description && (
                  <p className="text-xs text-gray-500 ml-6 mt-1">{task.description}</p>
                )}
                {task.status === 'in_progress' && (
                  <div className="ml-6 mt-1">
                    <Progress
                      className="h-1"
                      value={undefined}
                      aria-label="Indeterminate progress"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {state.tasks.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No tasks in progress
            </div>
          )}
        </CardContent>
      </Card>
    )
  });
  
  return null;
}
