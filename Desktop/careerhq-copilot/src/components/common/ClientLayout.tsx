'use client';

import { ReactNode } from 'react';
import { DebugPanel } from '../debug/DebugPanel';

interface ClientLayoutProps {
  children: ReactNode;
  showDebugTools?: boolean;
}

export function ClientLayout({ children, showDebugTools = true }: ClientLayoutProps) {
  return (
    <>
      {children}
      {showDebugTools && <DebugPanel />}
    </>
  );
}
