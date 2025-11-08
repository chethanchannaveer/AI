# Agentverse - Autonomous Agent Platform

> **Production-ready autonomous agents with memory, reasoning, intelligence, and creativity**

A sophisticated full-stack platform demonstrating autonomous agents with deep Replit integration, real-time code execution, intelligent task planning, and seamless booking navigation.

## 🚀 Quick Start

**Zero Configuration Required** - Just click Run!

```bash
npm run dev
```

The application runs immediately with a local LLM simulator. No API keys needed.

## ✨ Key Features

### 🤖 Intelligent Task Automation
- **Memory System**: Agents remember context across conversations
- **Reasoning Engine**: Break down complex tasks into actionable steps
- **Creativity**: Generate novel solutions using AI
- **Auto-Detection**: Automatically switches between local simulator and real LLMs

### 🎯 Core Capabilities

#### 1. **Dashboard**
- Real-time agent monitoring
- Performance metrics (tasks completed, success rate)
- Live activity feed with system events
- Create and manage multiple autonomous agents

#### 2. **Agent Chat**
- Conversational interface with intelligent agents
- Context retention across messages
- Real-time typing indicators
- WebSocket-powered instant responses

#### 3. **Code Sandbox**
- Safe code execution environment
- Real-time output console
- Multiple language support
- Performance metrics

#### 4. **Travel Planner** ✈️
- **Budget-Aware Planning**: Enter budget, destination, and dates
- **Smart Intent Detection**: AI analyzes what you need
- **Package Deals**: Flight + Hotel bundles to save 10-30%
- **Official Site Navigation**: Direct links to Expedia, Booking.com, Google Flights, Skyscanner, etc.
- **Category-Specific Sites**: Flights, Hotels, Restaurants, Events & Tickets

#### 5. **Learning Assistant** 📚
- **AI-Powered Quiz Generation**: Create custom quizzes on any topic
- **Study Schedules**: Plan learning sessions with dates and times
- **Progress Tracking**: Monitor quiz scores and study hours
- **Interactive Quizzes**: Multiple choice with instant feedback and explanations

#### 6. **Activity Logs**
- Comprehensive system event tracking
- Filter by success, errors, warnings
- Export logs for analysis
- Real-time updates

## 🧠 Autonomous Agent System

### LLM Provider Architecture

The platform features a **smart LLM provider** that automatically detects available API keys:

```typescript
// Auto-detects and uses:
1. Local LLM Simulator (default - no API keys needed)
2. OpenAI GPT-4 (if OPENAI_API_KEY is set)
3. Anthropic Claude (if ANTHROPIC_API_KEY is set)
```

### Local LLM Simulator

**Zero-dependency operation** with deterministic templates + controlled randomness:

- Task breakdown and planning
- Code generation
- Booking intent detection
- Quiz creation
- General conversation

No external APIs required - perfect for development and testing!

### Agent Memory System

Agents maintain context through:
- **Short-term memory**: Recent conversations (last 20 entries)
- **Long-term memory**: Categorized by type (tasks, conversations, learning, preferences)
- **Context retrieval**: Smart search across memory
- **Preference learning**: Remembers user preferences over time

### Task Automation Engine

1. **Planning Phase**: LLM breaks down task into 3-5 specific steps
2. **Execution Phase**: Each step executed with progress tracking
3. **Memory Storage**: Results stored for future reference
4. **Self-Correction**: Can adjust based on intermediate results

## 🔌 API Endpoints

### Agent Management
```bash
GET    /api/agents              # List all agents
POST   /api/agents              # Create new agent
DELETE /api/agents/:id          # Delete agent
POST   /api/agents/:id/task     # Execute task
POST   /api/agents/:id/chat     # Chat with agent
```

### System
```bash
GET    /api/system/llm-provider # Get current LLM provider status
```

### Learning
```bash
POST   /api/learning/generate-quiz  # Generate AI quiz
```

### Booking
```bash
POST   /api/booking/detect-intent   # Detect booking intent
```

## 🌐 WebSocket Support

Real-time agent communication via WebSocket:

```javascript
// Connect
const ws = new WebSocket('ws://localhost:5000/ws');

// Chat with agent
ws.send(JSON.stringify({
  type: 'agent_chat',
  agentId: 'agent-123',
  message: 'Create a React component'
}));

// Receive response
ws.on('message', (data) => {
  const { type, content } = JSON.parse(data);
  // Handle agent response
});
```

## 🔑 Optional: Real LLM Integration

### Add OpenAI Support
1. Set environment variable: `OPENAI_API_KEY=sk-...`
2. Restart the application
3. Agents automatically use GPT-4

### Add Anthropic Support
1. Set environment variable: `ANTHROPIC_API_KEY=sk-ant-...`
2. Restart the application
3. Agents automatically use Claude 3.5 Sonnet

**The platform detects which provider is available and uses the best one automatically.**

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with Vite
- **Routing**: Wouter
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: TanStack Query
- **Real-time**: WebSocket client
- **Forms**: React Hook Form + Zod validation

### Backend (Node.js + TypeScript)
- **Framework**: Express.js
- **AI Integration**: OpenAI SDK, Anthropic SDK
- **WebSockets**: ws library
- **Storage**: In-memory (easily extensible to PostgreSQL)
- **Execution**: Safe code sandboxing

### Agent System
```
AgentManager
  ├── TaskAutomationAgent (with memory & reasoning)
  │   ├── LLMProvider (auto-detects best provider)
  │   │   ├── LocalSimulator (deterministic + stochastic)
  │   │   ├── OpenAI GPT-4
  │   │   └── Anthropic Claude
  │   └── AgentMemory (short-term + long-term)
  └── Multiple agent instances
```

## 📦 Tech Stack

**Frontend:**
- React, TypeScript, Vite
- Tailwind CSS, Shadcn UI
- TanStack Query, Wouter
- Lucide Icons, Framer Motion

**Backend:**
- Node.js, Express, TypeScript
- OpenAI SDK, Anthropic SDK
- WebSocket (ws)
- In-memory storage

**Development:**
- TSX for TypeScript execution
- ESLint, Prettier
- Hot Module Replacement

## 🎨 Design System

- **Typography**: Inter (UI), JetBrains Mono (code)
- **Color Scheme**: Professional blue primary, semantic status colors
- **Dark Mode**: Full support with system preference detection
- **Components**: Production-ready Shadcn components
- **Accessibility**: WCAG AA compliant

## 🔒 Security

- **API Keys**: Environment variable management
- **Code Execution**: Sandboxed environment
- **Input Validation**: Zod schema validation
- **CORS**: Configured for Replit domains
- **WebSocket**: Secure connections only

## 🚢 Deployment

This application is **Replit-optimized** and ready to deploy:

1. The `.replit` file is configured for instant run
2. All dependencies are installed automatically
3. Works perfectly in Replit's deployment infrastructure
4. Use the "Deploy" button for production deployment

## 📝 Usage Examples

### Create an Agent
```typescript
const agent = await fetch('/api/agents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'My Assistant' })
});
```

### Execute a Task
```typescript
const result = await fetch(`/api/agents/${agentId}/task`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    task: 'Create a React component for user profile' 
  })
});
```

### Chat with Agent
```typescript
const response = await fetch(`/api/agents/${agentId}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: 'Help me plan a trip to Tokyo' 
  })
});
```

### Generate Quiz
```typescript
const quiz = await fetch('/api/learning/generate-quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    topic: 'JavaScript',
    goals: 'Focus on async/await and promises'
  })
});
```

## 🎯 Use Cases

1. **Developers**: Code generation, debugging assistance, architecture planning
2. **Students**: Personalized quizzes, study schedules, concept explanations
3. **Travelers**: Budget trip planning, booking site navigation, itinerary creation
4. **Teams**: Task automation, workflow orchestration, intelligent assistance

## 🔮 Future Enhancements

- [ ] Persistent storage with PostgreSQL
- [ ] Multi-agent collaboration
- [ ] Advanced code execution with npm package support
- [ ] Plugin system for extending agent capabilities
- [ ] Voice interface
- [ ] Mobile app
- [ ] Agent marketplace

## 📄 License

MIT License - feel free to use this as a foundation for your own autonomous agent systems.

## 🙏 Acknowledgments

- Built with Replit's powerful development platform
- Powered by OpenAI and Anthropic's cutting-edge AI models
- Inspired by the future of autonomous software systems

---

**Made with ❤️ for the autonomous future**
