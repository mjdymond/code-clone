import { ReactNode, createContext, useContext, useState } from 'react';
import { cn } from '../../utils/cn';

type TabsContextType = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}

interface TabsProps {
  value?: string;
  defaultTab?: string;
  children: ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ value, defaultTab, children, className, onValueChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(value || defaultTab || '');

  const handleTabChange = (id: string) => {
    if (onValueChange) {
      onValueChange(id);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab: value || activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: ReactNode;
  className?: string;
}

// Export both TabList and TabsList for compatibility
export function TabList({ children, className }: TabListProps) {
  return (
    <div
      className={cn(
        'flex h-10 items-center justify-start border-b border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
}

export const TabsList = TabList;

interface TabProps {
  id?: string;
  value?: string;
  children: ReactNode;
  className?: string;
}

export function Tab({ id, value, children, className }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();
  const tabValue = value || id || '';
  const isActive = activeTab === tabValue;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(tabValue)}
      className={cn(
        'inline-flex h-full items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'border-b-2 border-primary text-foreground'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  );
}

// Export TabTrigger for compatibility
export const TabsTrigger = Tab;

interface TabPanelProps {
  id?: string;
  value?: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, value, children, className }: TabPanelProps) {
  const { activeTab } = useTabs();
  const tabValue = value || id || '';
  const isActive = activeTab === tabValue;

  if (!isActive) return null;

  return <div className={cn('mt-4', className)}>{children}</div>;
}

// Export TabsContent for compatibility
export const TabsContent = TabPanel;
