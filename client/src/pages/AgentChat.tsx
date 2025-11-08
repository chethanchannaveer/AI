import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ChatMessage from "@/components/ChatMessage";
import StatusBadge from "@/components/StatusBadge";
import { Send, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AgentChat() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // TODO: Remove mock data - replace with real conversation data from backend
  const [messages, setMessages] = useState([
    { role: "agent" as const, content: "Hello! I'm your Booking Assistant. I can help you find and navigate to official booking websites for flights, hotels, restaurants, and events. What would you like to book today?", timestamp: "2:30 PM", agentName: "Booking Assistant" },
    { role: "user" as const, content: "I need to book a flight to New York next week", timestamp: "2:32 PM" },
    { role: "agent" as const, content: "I'll help you find flights to New York. Based on your request, I recommend using these official booking websites:\n\n• Expedia - Compare multiple airlines\n• Google Flights - Best price tracking\n• Kayak - Flexible date search\n\nWould you like me to navigate you to one of these sites with your search pre-filled?", timestamp: "2:32 PM", agentName: "Booking Assistant" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    // TODO: Replace with actual API call to send message to agent
    const newMessage = { role: "user" as const, content: message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // TODO: Replace with actual agent response from backend
      setMessages(prev => [...prev, {
        role: "agent" as const,
        content: "I understand your request. Let me analyze the best options for you...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: "Booking Assistant"
      }]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex">
      {/* Chat Thread */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Agent Chat</h1>
          <p className="text-sm text-muted-foreground">Communicate with your autonomous agents</p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => (
              <ChatMessage key={index} {...msg} />
            ))}
            {isTyping && (
              <div className="flex gap-3 mb-4">
                <div className="flex items-center gap-1 bg-card border border-card-border rounded-lg px-4 py-3">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Textarea
              placeholder="Type your message... (Shift+Enter for new line)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="resize-none min-h-[60px]"
              data-testid="input-message"
            />
            <div className="flex flex-col gap-2">
              <Button onClick={handleSend} data-testid="button-send">
                <Send className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setMessages([])}
                data-testid="button-clear"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <div className="w-80 border-l p-6 bg-card/50">
        <h2 className="text-lg font-semibold mb-4">Agent Context</h2>
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Booking Assistant</h3>
            <StatusBadge status="active" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">Current Task</p>
          <p className="text-sm">Analyzing booking intent and providing navigation to official sites</p>
        </Card>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2 text-sm">Capabilities</h3>
            <div className="space-y-1">
              {["Intent Detection", "Booking Navigation", "URL Construction", "Site Recommendations"].map((cap) => (
                <div key={cap} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  {cap}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-sm">Memory</h3>
            <p className="text-sm text-muted-foreground">
              Conversation: {messages.length} messages<br />
              Context retained: All booking preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
