import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className }: FormGroupProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}
