import { useCoAgent } from "@copilotkit/react-core";

export type Contribution = {
  timestamp: string;
  description: string;
  value: number;
};

export type AgentProgressState = { 
  completion_status: number;
  contributions: Contribution[];
  last_updated: string | null;
  currentAction?: string;
  analyzing?: boolean;
  thinking?: string;
};

export function useAgentProgress(agentName: string) {
  const { state, setState } = useCoAgent<AgentProgressState>({
    name: `${agentName}_progress`,
    initialState: { 
      completion_status: 0,
      contributions: [],
      last_updated: null,
      analyzing: false
    }
  });
  
  const updateProgress = (completion: number, contributionDescription: string) => {
    setState(prevState => ({
      ...prevState,
      completion_status: completion,
      contributions: [
        ...prevState.contributions, 
        {
          timestamp: new Date().toISOString(),
          description: contributionDescription,
          value: completion - (prevState.completion_status || 0)
        }
      ],
      last_updated: new Date().toISOString()
    }));
  };

  const updateThinking = (thinking: string) => {
    setState(prevState => ({
      ...prevState,
      thinking,
      last_updated: new Date().toISOString()
    }));
  };

  const setCurrentAction = (currentAction: string) => {
    setState(prevState => ({
      ...prevState,
      currentAction,
      last_updated: new Date().toISOString()
    }));
  };

  const startAnalyzing = () => {
    setState(prevState => ({
      ...prevState,
      analyzing: true,
      completion_status: 0,
      last_updated: new Date().toISOString()
    }));
  };

  const stopAnalyzing = () => {
    setState(prevState => ({
      ...prevState,
      analyzing: false,
      completion_status: 100,
      last_updated: new Date().toISOString()
    }));
  };
  
  return {
    progress: state,
    updateProgress,
    updateThinking,
    setCurrentAction,
    startAnalyzing,
    stopAnalyzing
  };
}
