"use client";

import {
  Reasoning,
  ReasoningContent,
  ReasoningResponse,
  ReasoningTrigger,
} from "@/components/prompt-kit/reasoning";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ComplexReasoningExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeExample, setActiveExample] = useState("math");

  const examples = {
    math: {
      result: "The sum of all integers from 1 to 100 is 5,050.",
      reasoning: `Here's my approach to calculating the sum of integers from 1 to 100:

## Method 1: Arithmetic Series Formula
I'll use the formula for the sum of an arithmetic series:
\`Sum = n/2 × (first term + last term)\`

Where:
- n = number of terms (100)
- first term = 1
- last term = 100

Substituting these values:
\`Sum = 100/2 × (1 + 100)\`
\`Sum = 50 × 101\`
\`Sum = 5,050\`

## Method 2: Gauss's Method
I can pair the numbers from opposite ends:
- 1 + 100 = 101
- 2 + 99 = 101
- 3 + 98 = 101
...and so on

There are 50 such pairs (100/2), each summing to 101.
Therefore: \`Sum = 50 × 101 = 5,050\``
    },
    resume: {
      result: "Your resume should emphasize leadership experience and quantifiable achievements.",
      reasoning: `# Resume Analysis and Recommendations

## Key Observations
1. Current resume focuses heavily on technical skills but lacks quantifiable achievements
2. Leadership experience is mentioned but not highlighted properly
3. Structure needs improvement for better ATS optimization

## Rationale for Recommendations
### Emphasizing Leadership
- Leadership skills are highly valued for senior positions
- Current resume mentions team leadership in project X, but doesn't showcase your specific leadership contributions
- By highlighting leadership accomplishments more prominently, you'll differentiate from other technical candidates

### Adding Quantifiable Achievements
- Recruiters and hiring managers look for measurable impact
- Your work on Project Y increased efficiency by 40% (according to your input)
- Adding these metrics makes your contributions concrete rather than abstract
- Quantifiable achievements help pass initial ATS screening

### ATS Optimization
- Current format uses complex tables which can confuse ATS systems
- Recommended structure uses standard headers and bullet points
- Keywords from job descriptions will be more easily recognized in the simplified format`
    },
    coding: {
      result: "The optimal solution for finding duplicate elements uses a hash map with O(n) time complexity.",
      reasoning: `# Algorithm Analysis: Finding Duplicates in an Array

## Problem Statement
Given an array of integers, find all elements that appear more than once.

## Approach 1: Nested Loops
\`\`\`javascript
function findDuplicates(nums) {
  const duplicates = [];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j] && !duplicates.includes(nums[i])) {
        duplicates.push(nums[i]);
      }
    }
  }
  return duplicates;
}
\`\`\`

**Time Complexity**: O(n²) - Not optimal for large inputs
**Space Complexity**: O(k) where k is the number of duplicates

## Approach 2: Sorting
\`\`\`javascript
function findDuplicates(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const duplicates = [];
  
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i-1] && (i === 1 || sorted[i] !== sorted[i-2])) {
      duplicates.push(sorted[i]);
    }
  }
  return duplicates;
}
\`\`\`

**Time Complexity**: O(n log n) - Better but still not optimal
**Space Complexity**: O(n) for the sorted array

## Approach 3: Hash Map (Optimal)
\`\`\`javascript
function findDuplicates(nums) {
  const seen = new Map();
  const duplicates = [];
  
  for (const num of nums) {
    if (seen.has(num)) {
      if (seen.get(num) === 1) {
        duplicates.push(num);
      }
      seen.set(num, seen.get(num) + 1);
    } else {
      seen.set(num, 1);
    }
  }
  return duplicates;
}
\`\`\`

**Time Complexity**: O(n) - Optimal solution
**Space Complexity**: O(n) in worst case

## Conclusion
The hash map approach is optimal with O(n) time complexity, making it the best choice for large inputs.`
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Tabs value={activeExample} onValueChange={setActiveExample}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="math">Math Problem</TabsTrigger>
          <TabsTrigger value="resume">Resume Analysis</TabsTrigger>
          <TabsTrigger value="coding">Coding Solution</TabsTrigger>
        </TabsList>
        
        {Object.entries(examples).map(([key, example]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-base">{example.result}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(!isOpen)}
              >
                {isOpen ? "Hide reasoning" : "Show reasoning"}
              </Button>
            </div>
            <div className="rounded-md border p-4">
              <Reasoning open={isOpen} onOpenChange={handleOpenChange}>
                <div className="flex items-center justify-between">
                  <ReasoningTrigger>View detailed reasoning</ReasoningTrigger>
                  <p className="text-muted-foreground text-xs">
                    State: {isOpen ? "Open" : "Closed"}
                  </p>
                </div>
                <ReasoningContent className="mt-3">
                  <ReasoningResponse text={example.reasoning} />
                </ReasoningContent>
              </Reasoning>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
