// Agent Manager - Orchestrates multiple agents

import { TaskAutomationAgent } from "./TaskAutomationAgent";

interface AgentInfo {
  id: string;
  name: string;
  status: "idle" | "active" | "executing";
  tasksCompleted: number;
  successRate: number;
  currentTask?: string;
}

export class AgentManager {
  private agents: Map<string, TaskAutomationAgent> = new Map();
  private taskCounts: Map<string, number> = new Map();

  // Create a new agent
  createAgent(name: string): AgentInfo {
    const id = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const agent = new TaskAutomationAgent(id, name);
    
    this.agents.set(id, agent);
    this.taskCounts.set(id, 0);

    console.log(`✓ Created agent: ${name} (${id})`);

    return {
      id,
      name,
      status: "idle",
      tasksCompleted: 0,
      successRate: 100
    };
  }

  // Get agent by ID
  getAgent(id: string): TaskAutomationAgent | undefined {
    return this.agents.get(id);
  }

  // Get all agents
  getAllAgents(): AgentInfo[] {
    const agents: AgentInfo[] = [];
    
    Array.from(this.agents.entries()).forEach(([id, agent]) => {
      const tasksCompleted = this.taskCounts.get(id) || 0;
      agents.push({
        id,
        name: agent.getName(),
        status: "idle", // TODO: Track actual status
        tasksCompleted,
        successRate: Math.floor(92 + Math.random() * 8) // Mock success rate
      });
    });

    return agents;
  }

  // Execute task with agent
  async executeTask(agentId: string, taskDescription: string): Promise<any> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    const task = await agent.processTask(taskDescription);
    
    // Update task count
    const count = (this.taskCounts.get(agentId) || 0) + 1;
    this.taskCounts.set(agentId, count);

    return task;
  }

  // Chat with agent
  async chatWithAgent(agentId: string, message: string): Promise<string> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    return await agent.chat(message);
  }

  // Delete agent
  deleteAgent(agentId: string): boolean {
    this.taskCounts.delete(agentId);
    return this.agents.delete(agentId);
  }
}

// Singleton instance
export const agentManager = new AgentManager();

// Create default agents
agentManager.createAgent("Code Generator");
agentManager.createAgent("Booking Assistant");
agentManager.createAgent("Learning Coach");
