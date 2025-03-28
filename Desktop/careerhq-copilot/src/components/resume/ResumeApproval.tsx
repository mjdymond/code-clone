"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ResumeChange {
  description: string;
  section: string;
  importance: "low" | "medium" | "high";
}

interface ResumeApprovalProps {
  original: string;
  improved: string;
  changes: ResumeChange[];
  onApprove: () => void;
  onReject: () => void;
}

export function ResumeApproval({
  original,
  improved,
  changes,
  onApprove,
  onReject,
}: ResumeApprovalProps) {
  const [selectedChanges, setSelectedChanges] = useState<Record<number, boolean>>(
    changes.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );
  
  const allSelected = Object.values(selectedChanges).every(value => value);
  
  const toggleChange = (index: number) => {
    setSelectedChanges(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  
  const selectAll = () => {
    setSelectedChanges(
      changes.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
    );
  };
  
  const deselectAll = () => {
    setSelectedChanges(
      changes.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
    );
  };
  
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="changes-list space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Suggested Improvements</h3>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Deselect All
            </button>
          </div>
        </div>
        
        <div className="divide-y">
          {changes.map((change, index) => (
            <div key={index} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                    selectedChanges[index]
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300 bg-white"
                  }`}
                  onClick={() => toggleChange(index)}
                >
                  {selectedChanges[index] && <Check className="h-3 w-3" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{change.section}</span>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs border ${getImportanceColor(
                        change.importance
                      )}`}
                    >
                      {change.importance}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{change.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="resume-content">
        <Tabs defaultValue="diff">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="diff" className="flex-1">Side by Side</TabsTrigger>
            <TabsTrigger value="original" className="flex-1">Original</TabsTrigger>
            <TabsTrigger value="improved" className="flex-1">Improved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="diff">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded p-3 bg-gray-50">
                <h4 className="text-sm font-medium mb-2 text-gray-500">Original</h4>
                <pre className="whitespace-pre-wrap text-sm font-mono">{original}</pre>
              </div>
              <div className="border rounded p-3 bg-gray-50">
                <h4 className="text-sm font-medium mb-2 text-gray-500">Improved</h4>
                <pre className="whitespace-pre-wrap text-sm font-mono">{improved}</pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="original">
            <div className="border rounded p-3 bg-gray-50">
              <pre className="whitespace-pre-wrap text-sm font-mono">{original}</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="improved">
            <div className="border rounded p-3 bg-gray-50">
              <pre className="whitespace-pre-wrap text-sm font-mono">{improved}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onReject} className="gap-1">
          <X className="h-4 w-4" />
          Reject Changes
        </Button>
        <Button onClick={onApprove} className="gap-1">
          <Check className="h-4 w-4" />
          Apply Selected Changes
        </Button>
      </div>
    </div>
  );
}
