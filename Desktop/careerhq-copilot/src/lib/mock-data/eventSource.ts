import { mockResumeData } from './resume';
import { mockJobSearchData } from './jobSearch';
import { mockTaskRegistry } from './tasks';

export class MockEventSource {
  private controller: ReadableStreamDefaultController;
  private encoder: TextEncoder;
  private timeouts: NodeJS.Timeout[] = [];
  private isRunning = false;

  constructor(controller: ReadableStreamDefaultController) {
    this.controller = controller;
    this.encoder = new TextEncoder();
  }

  private sendEvent(eventType: string, data: any) {
    const eventData = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    this.controller.enqueue(this.encoder.encode(eventData));
  }

  public start() {
    this.isRunning = true;
    this.simulateResumeAnalysis();
    this.simulateTaskUpdates();
  }

  public stop() {
    this.isRunning = false;
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
  }

  private scheduleEvent(callback: () => void, delay: number) {
    const timeout = setTimeout(() => {
      if (this.isRunning) {
        callback();
      }
    }, delay);
    this.timeouts.push(timeout);
  }

  // Simulate a resume analysis workflow
  private simulateResumeAnalysis() {
    const steps = mockResumeData.analysisSteps;
    
    let currentStep = 0;
    const sendStep = () => {
      if (currentStep < steps.length) {
        this.sendEvent('agent_update', steps[currentStep]);
        currentStep++;
        
        // Schedule next step
        const delay = Math.random() * 2000 + 1000; // 1-3 seconds
        this.scheduleEvent(sendStep, delay);
      } else if (currentStep === steps.length) {
        // Send approval request
        this.scheduleEvent(() => {
          this.sendEvent('approval_request', mockResumeData.approvalRequest);
        }, 2000);
        
        currentStep++;
      }
    };
    
    // Start the sequence
    this.scheduleEvent(sendStep, 1000);
  }
  
  // Simulate task registry updates
  private simulateTaskUpdates() {
    const steps = mockTaskRegistry.steps;
    
    let currentStep = 0;
    const sendStep = () => {
      if (currentStep < steps.length) {
        this.sendEvent('task_update', steps[currentStep]);
        currentStep++;
        
        // Schedule next step
        const delay = Math.random() * 3000 + 2000; // 2-5 seconds
        this.scheduleEvent(sendStep, delay);
      }
    };
    
    // Start the sequence
    this.scheduleEvent(sendStep, 1500);
  }
  
  // Simulate job search if requested
  public simulateJobSearch() {
    const steps = mockJobSearchData.searchSteps;
    
    let currentStep = 0;
    const sendStep = () => {
      if (currentStep < steps.length) {
        this.sendEvent('agent_update', steps[currentStep]);
        currentStep++;
        
        // Schedule next step
        const delay = Math.random() * 2000 + 1000; // 1-3 seconds
        this.scheduleEvent(sendStep, delay);
      } else if (currentStep === steps.length) {
        // Send approval request
        this.scheduleEvent(() => {
          this.sendEvent('approval_request', mockJobSearchData.approvalRequest);
        }, 2000);
        
        currentStep++;
      }
    };
    
    // Start the sequence
    this.scheduleEvent(sendStep, 1000);
  }
}
