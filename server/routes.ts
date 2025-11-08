import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { agentManager } from "./agents/AgentManager";
import { llmProvider } from "./llm/LLMProvider";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup for real-time agent updates
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    
    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === "agent_chat") {
          const response = await agentManager.chatWithAgent(data.agentId, data.message);
          ws.send(JSON.stringify({ type: "agent_response", content: response }));
        }
      } catch (error) {
        console.error("WebSocket error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  // Get all agents
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = agentManager.getAllAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  // Create new agent
  app.post("/api/agents", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Agent name is required" });
      }

      const agent = agentManager.createAgent(name);
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  // Delete agent
  app.delete("/api/agents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = agentManager.deleteAgent(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Agent not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete agent" });
    }
  });

  // Execute task with agent
  app.post("/api/agents/:id/task", async (req, res) => {
    try {
      const { id } = req.params;
      const { task } = req.body;

      if (!task) {
        return res.status(400).json({ error: "Task description is required" });
      }

      const result = await agentManager.executeTask(id, task);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to execute task" });
    }
  });

  // Chat with agent
  app.post("/api/agents/:id/chat", async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await agentManager.chatWithAgent(id, message);
      res.json({ response, provider: llmProvider.getProvider() });
    } catch (error) {
      res.status(500).json({ error: "Failed to chat with agent" });
    }
  });

  // Get LLM provider status
  app.get("/api/system/llm-provider", async (req, res) => {
    try {
      res.json({
        provider: llmProvider.getProvider(),
        hasRealLLM: llmProvider.isRealLLMAvailable()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get provider status" });
    }
  });

  // Generate quiz (for learning assistant)
  app.post("/api/learning/generate-quiz", async (req, res) => {
    try {
      const { topic, goals } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      // Use LLM to generate quiz
      const messages = [
        {
          role: "system" as const,
          content: "You are a quiz generator. Create educational quiz questions with multiple choice options and explanations."
        },
        {
          role: "user" as const,
          content: `Generate 3 multiple-choice quiz questions about ${topic}. ${goals ? `Focus on: ${goals}` : ""}\n\nFormat each question as:\nQ: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: [letter]\nExplanation: [explanation]`
        }
      ];

      const response = await llmProvider.chat(messages);
      res.json({ content: response.content, provider: response.provider });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate quiz" });
    }
  });

  // Detect booking intent
  app.post("/api/booking/detect-intent", async (req, res) => {
    try {
      const { query, budget, destination, dates } = req.body;

      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      // Use LLM to detect intent
      const messages = [
        {
          role: "system" as const,
          content: "You are a travel booking assistant. Analyze user requests and determine what they want to book."
        },
        {
          role: "user" as const,
          content: `Analyze this booking request:\n${query}\n${budget ? `Budget: ${budget}` : ""}\n${destination ? `Destination: ${destination}` : ""}\n${dates ? `Dates: ${dates}` : ""}\n\nWhat is the user trying to book? (flights, hotels, packages, restaurants, events)`
        }
      ];

      const response = await llmProvider.chat(messages);
      res.json({ intent: response.content, provider: response.provider });
    } catch (error) {
      res.status(500).json({ error: "Failed to detect intent" });
    }
  });

  return httpServer;
}
