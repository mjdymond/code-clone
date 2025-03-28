"use client";

import * as React from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import { cn } from "@/lib/utils";

interface PromptInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit?: () => void;
}

interface PromptInputTextareaProps
  extends Omit<TextareaAutosizeProps, "value" | "onChange"> {}

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, value, onValueChange, onSubmit, children, ...props }, ref) => {
    // Context to share state with child components
    const contextValue = React.useMemo(
      () => ({
        value,
        onValueChange,
        onSubmit,
      }),
      [value, onValueChange, onSubmit]
    );

    return (
      <PromptInputContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex w-full flex-col overflow-hidden rounded-lg bg-background p-2",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    );
  }
);
PromptInput.displayName = "PromptInput";

const PromptInputContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  onSubmit?: () => void;
} | null>(null);

function usePromptInput() {
  const context = React.useContext(PromptInputContext);
  if (!context) {
    throw new Error(
      "PromptInput compound components must be used within a PromptInput component"
    );
  }
  return context;
}

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(({ className, onKeyDown, ...props }, ref) => {
  const { value, onValueChange, onSubmit } = usePromptInput();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyDown) {
      onKeyDown(event);
    }

    if (event.key === "Enter" && !event.shiftKey && onSubmit) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <TextareaAutosize
      ref={ref}
      className={cn(
        "w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={handleKeyDown}
      rows={1}
      {...props}
    />
  );
});
PromptInputTextarea.displayName = "PromptInputTextarea";

const PromptInputActions = React.forwardRef<
  HTMLDivElement,
  PromptInputActionsProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center px-2", className)}
      {...props}
    />
  );
});
PromptInputActions.displayName = "PromptInputActions";

export { PromptInput, PromptInputTextarea, PromptInputActions };
