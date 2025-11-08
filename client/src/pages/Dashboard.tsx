import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MetricCard from "@/components/MetricCard";
import AgentCard from "@/components/AgentCard";
import ActivityFeedItem from "@/components/ActivityFeedItem";
import { Cpu, Activity, CheckCircle, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Remove mock data - replace with real agent data from backend
  const mockAgents = [
    {
      id: "agent-001",
      name: "Code Generator",
      status: "executing" as const,
      currentTask: "Generating React component for user dashboard with TypeScript and Tailwind CSS",
      tasksCompleted: 45,
      successRate: 96,
    },
    {
      id: "agent-002",
      name: "Data Analyst",
      status: "active" as const,
      currentTask: "Processing sales data from Q4 2024 and generating insights",
      tasksCompleted: 132,
      successRate: 98,
    },
    {
      id: "agent-003",
      name: "Booking Assistant",
      status: "idle" as const,
      tasksCompleted: 67,
      successRate: 92,
    },
    {
      id: "agent-004",
      name: "API Debugger",
      status: "error" as const,
      currentTask: "Failed to connect to external API endpoint",
      tasksCompleted: 23,
      successRate: 88,
    },
    {
      id: "agent-005",
      name: "Test Writer",
      status: "pending" as const,
      currentTask: "Waiting for code generation to complete",
      tasksCompleted: 89,
      successRate: 95,
    },
  ];

  // TODO: Remove mock data - replace with real activity data from backend
  const mockActivities = [
    { title: "Agent Created", description: "New agent 'Code Generator' initialized with default capabilities", timestamp: "2m ago", type: "success" as const },
    { title: "Task Completed", description: "Successfully generated 3 React components with TypeScript", timestamp: "5m ago", type: "success" as const },
    { title: "Execution Error", description: "Failed to compile generated code due to syntax error in line 42", timestamp: "12m ago", type: "error" as const },
    { title: "System Update", description: "LLM provider switched from local simulator to OpenAI GPT-4", timestamp: "1h ago", type: "info" as const },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="py-12 px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage your autonomous agents</p>
            </div>
            <div className="flex gap-2">
              <Button data-testid="button-create-agent">
                <Plus className="w-4 h-4 mr-2" />
                Create Agent
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Agents"
              value={mockAgents.length}
              trend={{ value: 8.2, direction: "up" }}
              icon={<Cpu className="w-6 h-6" />}
            />
            <MetricCard
              title="Active Tasks"
              value={mockAgents.filter(a => a.status === "executing" || a.status === "active").length}
              trend={{ value: -3.1, direction: "down" }}
              icon={<Activity className="w-6 h-6" />}
            />
            <MetricCard
              title="Success Rate"
              value="94%"
              trend={{ value: 2.5, direction: "up" }}
              icon={<CheckCircle className="w-6 h-6" />}
            />
          </div>
        </div>
      </div>

      {/* Agent Grid Section */}
      <div className="py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Active Agents</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-agents"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                {...agent}
                onPause={() => console.log(`Pause ${agent.id}`)}
                onResume={() => console.log(`Resume ${agent.id}`)}
                onDelete={() => console.log(`Delete ${agent.id}`)}
                onClick={() => console.log(`View ${agent.id} details`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="py-8 px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-6">Activity Timeline</h2>
              <div>
                {mockActivities.map((activity, index) => (
                  <ActivityFeedItem
                    key={index}
                    {...activity}
                    isLast={index === mockActivities.length - 1}
                  />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-6">System Stats</h2>
              <Card className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">CPU Usage</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[45%]" />
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Memory Usage</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[62%]" />
                    </div>
                    <span className="text-sm font-medium">62%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">LLM Provider</p>
                  <p className="text-sm font-medium">Local Simulator</p>
                  <p className="text-xs text-muted-foreground mt-1">Add API key to enable real LLM</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
