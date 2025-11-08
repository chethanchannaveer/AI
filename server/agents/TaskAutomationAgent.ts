// Task Automation Agent - Intelligent, creative, with memory and reasoning

import { llmProvider } from "../llm/LLMProvider";
import { AgentMemory } from "./AgentMemory";

interface TaskStep {
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  result?: string;
}

interface Task {
  id: string;
  description: string;
  steps: TaskStep[];
  status: "planning" | "executing" | "completed" | "failed";
  createdAt: Date;
}

export class TaskAutomationAgent {
  private id: string;
  private name: string;
  private memory: AgentMemory;
  private currentTask: Task | null = null;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.memory = new AgentMemory();
  }

  // Main reasoning engine - breaks down tasks intelligently
  async processTask(taskDescription: string): Promise<Task> {
    console.log(`[${this.name}] Processing task: ${taskDescription}`);

    // Create task
    const task: Task = {
      id: `task-${Date.now()}`,
      description: taskDescription,
      steps: [],
      status: "planning",
      createdAt: new Date()
    };

    this.currentTask = task;

    // Step 1: Reasoning - Plan the task
    await this.planTask(task);

    // Step 2: Execution - Execute each step
    await this.executeTask(task);

    // Store in memory
    this.memory.addTask(taskDescription, {
      taskId: task.id,
      stepsCount: task.steps.length,
      status: task.status
    });

    return task;
  }

  private async planTask(task: Task) {
    console.log(`[${this.name}] Planning task...`);
    task.status = "planning";

    // Use LLM to intelligently break down the task
    const messages = [
      {
        role: "system" as const,
        content: `You are an intelligent task automation agent. Break down tasks into clear, actionable steps. Be creative and thorough.`
      },
      {
        role: "user" as const,
        content: `Break down this task into 3-5 specific steps:\n${task.description}`
      }
    ];

    const response = await llmProvider.chat(messages);
    console.log(`[${this.name}] Plan created using ${response.provider}`);

    // Parse steps (simple heuristic for demo)
    const steps = this.parseStepsFromResponse(response.content);
    task.steps = steps;

    // Store planning in memory
    this.memory.addConversation(`Planned: ${task.description}`, {
      stepsCreated: steps.length
    });
  }

  private parseStepsFromResponse(response: string): TaskStep[] {
    // Extract numbered steps or bullet points
    const lines = response.split("\n").filter(line => line.trim());
    const steps: TaskStep[] = [];

    for (const line of lines) {
      // Match patterns like "1.", "•", "-", "Step 1:", etc.
      if (/^[\d•\-*]|step\s*\d/i.test(line.trim())) {
        const description = line.replace(/^[\d•\-*.\s)]+|step\s*\d+:?\s*/i, "").trim();
        if (description && description.length > 5) {
          steps.push({
            description,
            status: "pending"
          });
        }
      }
    }

    // If no steps found, create generic ones
    if (steps.length === 0) {
      steps.push(
        { description: "Analyze requirements", status: "pending" },
        { description: "Execute main task", status: "pending" },
        { description: "Verify results", status: "pending" }
      );
    }

    return steps.slice(0, 5); // Max 5 steps
  }

  private async executeTask(task: Task) {
    console.log(`[${this.name}] Executing task...`);
    task.status = "executing";

    for (const step of task.steps) {
      step.status = "in_progress";
      
      // Use creativity and intelligence to execute
      const result = await this.executeStep(step, task);
      step.result = result;
      step.status = "completed";

      console.log(`[${this.name}] Completed step: ${step.description}`);
    }

    task.status = "completed";
  }

  private async executeStep(step: TaskStep, task: Task): Promise<string> {
    // Simulate step execution with LLM assistance
    const messages = [
      {
        role: "system" as const,
        content: `You are executing a task automation step. Be creative and provide detailed results.`
      },
      {
        role: "user" as const,
        content: `Task: ${task.description}\nExecute this step: ${step.description}\nProvide a brief result.`
      }
    ];

    const response = await llmProvider.chat(messages);
    return response.content.substring(0, 200); // Limit result length
  }

  // Chat with agent (with memory)
  async chat(userMessage: string): Promise<string> {
    // Add to memory
    this.memory.addConversation(`User: ${userMessage}`);

    // Get conversation context
    const history = this.memory.getConversationHistory(5);

    const messages = [
      {
        role: "system" as const,
        content: `You are ${this.name}, an intelligent task automation agent with memory, reasoning, and creativity. You help users accomplish tasks efficiently.`
      },
      ...history.slice(-5).map(msg => ({
        role: "user" as const,
        content: msg
      })),
      {
        role: "user" as const,
        content: userMessage
      }
    ];

    const response = await llmProvider.chat(messages);

    // Store response in memory
    this.memory.addConversation(`Assistant: ${response.content}`);

    return response.content;
  }

  // Get agent status
  getStatus() {
    return {
      id: this.id,
      name: this.name,
      currentTask: this.currentTask,
      memorySummary: this.memory.getSummary(),
      provider: llmProvider.getProvider()
    };
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getMemory() {
    return this.memory;
  }
}
