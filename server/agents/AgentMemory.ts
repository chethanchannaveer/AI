// Agent Memory System - Context retention and learning

interface MemoryEntry {
  timestamp: Date;
  type: "conversation" | "task" | "learning" | "preference";
  content: string;
  metadata?: Record<string, any>;
}

export class AgentMemory {
  private shortTermMemory: MemoryEntry[] = [];
  private longTermMemory: Map<string, MemoryEntry[]> = new Map();
  private maxShortTermSize = 20;

  // Store conversation context
  addConversation(content: string, metadata?: Record<string, any>) {
    this.addMemory({
      timestamp: new Date(),
      type: "conversation",
      content,
      metadata
    });
  }

  // Store completed tasks
  addTask(content: string, metadata?: Record<string, any>) {
    this.addMemory({
      timestamp: new Date(),
      type: "task",
      content,
      metadata
    });
  }

  // Store learned information
  addLearning(content: string, metadata?: Record<string, any>) {
    this.addMemory({
      timestamp: new Date(),
      type: "learning",
      content,
      metadata
    });
  }

  // Store user preferences
  addPreference(content: string, metadata?: Record<string, any>) {
    this.addMemory({
      timestamp: new Date(),
      type: "preference",
      content,
      metadata
    });
  }

  private addMemory(entry: MemoryEntry) {
    this.shortTermMemory.push(entry);

    // Move to long-term if exceeding capacity
    if (this.shortTermMemory.length > this.maxShortTermSize) {
      const old = this.shortTermMemory.shift()!;
      const key = old.type;
      
      if (!this.longTermMemory.has(key)) {
        this.longTermMemory.set(key, []);
      }
      this.longTermMemory.get(key)!.push(old);
    }
  }

  // Retrieve relevant context
  getContext(type?: "conversation" | "task" | "learning" | "preference"): MemoryEntry[] {
    let memories = [...this.shortTermMemory];

    // Add relevant long-term memories
    if (type && this.longTermMemory.has(type)) {
      memories = [...memories, ...this.longTermMemory.get(type)!.slice(-5)];
    }

    if (type) {
      return memories.filter(m => m.type === type);
    }

    return memories;
  }

  // Get conversation history
  getConversationHistory(limit: number = 10): string[] {
    return this.shortTermMemory
      .filter(m => m.type === "conversation")
      .slice(-limit)
      .map(m => m.content);
  }

  // Search memories
  search(query: string): MemoryEntry[] {
    const allMemories = [
      ...this.shortTermMemory,
      ...Array.from(this.longTermMemory.values()).flat()
    ];

    return allMemories.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Clear short-term memory (new conversation)
  clearShortTerm() {
    this.shortTermMemory = [];
  }

  // Get summary for agent context
  getSummary(): string {
    const taskCount = this.shortTermMemory.filter(m => m.type === "task").length;
    const conversationCount = this.shortTermMemory.filter(m => m.type === "conversation").length;
    
    return `Memory: ${conversationCount} conversations, ${taskCount} tasks completed`;
  }
}
