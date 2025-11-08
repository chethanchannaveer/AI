// Local LLM Simulator - Deterministic templates with controlled randomness
// Works without any API keys for zero-dependency operation

interface SimulatorMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class LocalLLMSimulator {
  private templates = {
    taskBreakdown: [
      "I'll break this down into manageable steps:\n1. {step1}\n2. {step2}\n3. {step3}\nLet me start with the first step.",
      "Here's my plan to accomplish this:\n• First: {step1}\n• Then: {step2}\n• Finally: {step3}\nI'll begin working on this systematically.",
      "To complete this task, I need to:\n1. {step1}\n2. {step2}\n3. {step3}\nStarting with step one now."
    ],
    codeGeneration: [
      "I've generated the following code:\n```javascript\n{code}\n```\nThis implementation {explanation}.",
      "Here's the code solution:\n```javascript\n{code}\n```\n{explanation}",
      "I've created this for you:\n```javascript\n{code}\n```\nKey features: {explanation}"
    ],
    bookingIntent: [
      "I've detected you want to book {type}. Based on your request, I recommend visiting:\n• {site1} - {reason1}\n• {site2} - {reason2}\nWould you like me to navigate you to one of these?",
      "For {type} booking, here are the best options:\n1. {site1}: {reason1}\n2. {site2}: {reason2}\nClick any card below to proceed.",
    ],
    quizGeneration: [
      "I've created a {topic} quiz with {count} questions covering:\n• {area1}\n• {area2}\n• {area3}\nEach question includes detailed explanations.",
      "Here's your personalized {topic} quiz:\n- {count} carefully crafted questions\n- Topics: {area1}, {area2}, {area3}\n- Includes comprehensive explanations"
    ],
    general: [
      "I understand. {response}",
      "Based on your request, {response}",
      "Let me help with that. {response}",
      "{response}"
    ]
  };

  private randomVariations = [
    "absolutely", "certainly", "definitely", "of course", "sure thing",
    "right away", "immediately", "let me", "I'll", "I can"
  ];

  async chat(messages: SimulatorMessage[]): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    const userInput = lastMessage.content.toLowerCase();

    // Detect intent and generate appropriate response
    if (this.isTaskBreakdown(userInput)) {
      return this.generateTaskBreakdown(userInput);
    } else if (this.isCodeRequest(userInput)) {
      return this.generateCode(userInput);
    } else if (this.isBookingRequest(userInput)) {
      return this.generateBookingResponse(userInput);
    } else if (this.isQuizRequest(userInput)) {
      return this.generateQuizResponse(userInput);
    } else {
      return this.generateGeneral(userInput);
    }
  }

  private isTaskBreakdown(input: string): boolean {
    return input.includes("plan") || input.includes("break") || 
           input.includes("steps") || input.includes("how to");
  }

  private isCodeRequest(input: string): boolean {
    return input.includes("code") || input.includes("function") || 
           input.includes("implement") || input.includes("create a");
  }

  private isBookingRequest(input: string): boolean {
    return input.includes("book") || input.includes("flight") || 
           input.includes("hotel") || input.includes("restaurant");
  }

  private isQuizRequest(input: string): boolean {
    return input.includes("quiz") || input.includes("test") || 
           input.includes("questions") || input.includes("learn");
  }

  private generateTaskBreakdown(input: string): string {
    const template = this.randomChoice(this.templates.taskBreakdown);
    
    // Extract topic and create logical steps
    const steps = this.generateSteps(input);
    
    return template
      .replace("{step1}", steps[0])
      .replace("{step2}", steps[1])
      .replace("{step3}", steps[2]);
  }

  private generateSteps(input: string): string[] {
    // Simple heuristic-based step generation
    if (input.includes("website") || input.includes("app")) {
      return [
        "Set up the project structure and dependencies",
        "Implement the core functionality and components",
        "Test and deploy the application"
      ];
    } else if (input.includes("data") || input.includes("analysis")) {
      return [
        "Collect and clean the data",
        "Perform analysis and generate insights",
        "Create visualizations and reports"
      ];
    } else {
      return [
        "Understand the requirements and constraints",
        "Execute the main task components",
        "Verify results and make improvements"
      ];
    }
  }

  private generateCode(input: string): string {
    const template = this.randomChoice(this.templates.codeGeneration);
    
    // Generate simple code based on request
    let code = "";
    let explanation = "";
    
    if (input.includes("function") || input.includes("fibonacci")) {
      code = `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`;
      explanation = "uses recursion to calculate Fibonacci numbers efficiently";
    } else if (input.includes("api") || input.includes("fetch")) {
      code = `async function fetchData(url) {\n  const response = await fetch(url);\n  return response.json();\n}`;
      explanation = "handles async API calls with proper error handling";
    } else {
      code = `function processTask() {\n  // Implementation here\n  return result;\n}`;
      explanation = "provides a clean implementation structure";
    }
    
    return template
      .replace("{code}", code)
      .replace("{explanation}", explanation);
  }

  private generateBookingResponse(input: string): string {
    const template = this.randomChoice(this.templates.bookingIntent);
    
    let type = "travel";
    let site1 = "Expedia";
    let site2 = "Booking.com";
    let reason1 = "best package deals";
    let reason2 = "extensive hotel selection";
    
    if (input.includes("flight")) {
      type = "flights";
      site1 = "Google Flights";
      site2 = "Skyscanner";
      reason1 = "price tracking and flexible dates";
      reason2 = "worldwide flight comparison";
    } else if (input.includes("hotel")) {
      type = "hotels";
      site1 = "Booking.com";
      site2 = "Hotels.com";
      reason1 = "2.5M+ properties worldwide";
      reason2 = "rewards program benefits";
    }
    
    return template
      .replace("{type}", type)
      .replace("{site1}", site1)
      .replace("{site2}", site2)
      .replace("{reason1}", reason1)
      .replace("{reason2}", reason2);
  }

  private generateQuizResponse(input: string): string {
    const template = this.randomChoice(this.templates.quizGeneration);
    
    // Extract topic
    const topic = this.extractTopic(input) || "general knowledge";
    
    return template
      .replace("{topic}", topic)
      .replace("{count}", "5")
      .replace("{area1}", "fundamental concepts")
      .replace("{area2}", "practical applications")
      .replace("{area3}", "advanced techniques");
  }

  private generateGeneral(input: string): string {
    const template = this.randomChoice(this.templates.general);
    const variation = this.randomChoice(this.randomVariations);
    
    const response = `${variation}, I can help with that. Based on your request, I'll work on implementing the solution using best practices and proven patterns.`;
    
    return template.replace("{response}", response);
  }

  private extractTopic(input: string): string | null {
    const words = input.split(" ");
    const topicWords = ["javascript", "python", "react", "node", "typescript", "java", "sql"];
    
    for (const word of words) {
      if (topicWords.includes(word.toLowerCase())) {
        return word;
      }
    }
    
    return null;
  }

  private randomChoice<T>(array: T[]): T {
    // Controlled randomness using timestamp for deterministic variation
    const index = Math.floor(Date.now() / 1000) % array.length;
    return array[index];
  }
}
