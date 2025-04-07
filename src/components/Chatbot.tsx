
import { useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const { isLoggedIn, userName } = useAuth();
  const [hasUnread, setHasUnread] = useState(true);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "I'll help you with that!",
        "Let me check that for you.",
        "That's a good question. Here's what I found...",
        "I'm sorry, I don't have that information yet. Can I help with something else?",
        "Thank you for your question! Our customer service team will get back to you soon.",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <div className="fixed right-4 bottom-4 z-40">
      {/* Chat toggle button */}
      <Button
        onClick={toggleChat}
        className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
        variant="default"
      >
        {hasUnread && !isOpen && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 px-2">
            1
          </Badge>
        )}
        <MessageSquare size={24} />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-flipkart-blue dark:bg-gray-900 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-medium">Customer Support</h3>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8" onClick={toggleChat}>
              <X size={18} />
            </Button>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto max-h-80 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-flipkart-blue text-white rounded-br-none"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"
                  }`}
                >
                  {message.text}
                  <div
                    className={`text-xs mt-1 ${
                      message.isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
