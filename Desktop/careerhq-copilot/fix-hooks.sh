#!/bin/bash

# Run the component fixer on each problematic file directly
echo "Fixing RecruiterProgressTracker.tsx"
node scripts/component-fixer-updated.js src/components/agent/RecruiterProgressTracker.tsx

echo "Fixing AgentThinking.tsx"
node scripts/component-fixer-updated.js src/components/common/AgentThinking.tsx

echo "Fixing Navigation.tsx"
node scripts/component-fixer-updated.js src/components/common/Navigation.tsx

echo "Fixing AgentThinkingDemo.tsx"
node scripts/component-fixer-updated.js src/components/demo/AgentThinkingDemo.tsx

echo "Fixing ResumeApprovalDemo.tsx"
node scripts/component-fixer-updated.js src/components/demo/ResumeApprovalDemo.tsx

echo "Fixing ResumeApproval.tsx"
node scripts/component-fixer-updated.js src/components/resume/ResumeApproval.tsx

echo "All files fixed! Run npm run validate-hooks to verify."
