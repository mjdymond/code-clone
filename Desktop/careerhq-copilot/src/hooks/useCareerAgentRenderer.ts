'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { AgentState } from '@/types/agent';

interface RenderProps<T extends AgentState> {
  state: T;
  nodeName?: string;
  status: string;
}

interface UseCareerAgentRendererOptions<T extends AgentState> {
  name: string;
  node?: string;
  render: (props: RenderProps<T>) => React.ReactNode;
}

/**
 * Hook for rendering UI based on agent state
 * Similar to CopilotKit's useCoAgentStateRender but adapted for our needs
 */
export function useCareerAgentRenderer<T extends AgentState>({
  name,
  node,
  render
}: UseCareerAgentRendererOptions<T>) {
  const agents = useStore(state => state.agents);
  const [output, setOutput] = useState<React.ReactNode | null>(null);
  
  useEffect(() => {
    // Get the agent state
    const agentState = agents[name] as T | undefined;
    
    if (!agentState) {
      // Render nothing if the agent state doesn't exist yet
      setOutput(null);
      return;
    }
    
    // Render the UI based on the agent state
    const rendered = render({
      state: agentState,
      nodeName: node,
      status: agentState.status
    });
    
    setOutput(rendered);
  }, [agents, name, node, render]);
  
  return output;
}
