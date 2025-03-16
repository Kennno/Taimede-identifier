"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  MessageSquare,
  Send,
  Loader2,
  Bot,
  X,
  History,
  Clock,
  Trash2,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { identifyPlantWithGemini } from "@/lib/gemini";
import { supabase } from "../../supabase/supabase";
import { v4 as uuidv4 } from "uuid";
import ChatHistory from "./chat-history";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  conversation_id?: string;
  user_id?: string;
}

interface AIAssistantProps {
  user: User | null;
  isPremium: boolean;
}

export default function AIAssistant({ user, isPremium }: AIAssistantProps) {
  // Only show for premium users
  if (!isPremium) return null;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = isPremium
        ? "Hi there! I'm your plant care assistant. What plant questions can I help with today?"
        : "Hi there! I'm your plant care assistant. I can answer a few questions for free, or you can upgrade to premium for unlimited plant advice.";

      setMessages([
        {
          role: "assistant",
          content: greeting,
        },
      ]);
    }
  }, [isPremium]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessageToDatabase = async (
    message: Message,
    conversationId: string,
  ) => {
    if (!user) return;

    try {
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: message.role,
        content: message.content,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const createNewConversation = async () => {
    if (!user) return null;

    try {
      const conversationId = uuidv4();
      const title =
        messages.length > 0 && messages[0].role === "user"
          ? messages[0].content.substring(0, 50) +
            (messages[0].content.length > 50 ? "..." : "")
          : "New Conversation";

      const { error } = await supabase.from("chat_conversations").insert({
        id: conversationId,
        user_id: user.id,
        title: title,
      });

      if (error) throw error;
      return conversationId;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Create a new conversation if needed
    if (!currentConversationId && user) {
      const newConversationId = await createNewConversation();
      setCurrentConversationId(newConversationId);
    }

    // Add user message
    const userMessage: Message = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Save user message to database if logged in
    if (user && currentConversationId) {
      await saveMessageToDatabase(userMessage, currentConversationId);
    }

    try {
      // Call Gemini API for plant care advice
      const userQuery = input;
      const base64Image = ""; // No image for chat

      // Use the Gemini API to get a response
      const response = await identifyPlantWithGemini(
        base64Image,
        "en",
        userQuery,
      );

      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content:
          response.response ||
          "I'm not sure how to answer that. Could you try asking in a different way?",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to database if logged in
      if (user && currentConversationId) {
        await saveMessageToDatabase(assistantMessage, currentConversationId);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage =
        "Sorry, I encountered an error. Please try again later.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: isPremium
          ? "Hello! I'm your plant care assistant. Ask me anything about your plants, and I'll help you take care of them."
          : "Hello! I'm your plant care assistant. Upgrade to premium for unlimited access to plant care advice.",
      },
    ]);
    setCurrentConversationId(null);
  };

  const loadConversation = (conversationMessages: Message[]) => {
    if (conversationMessages.length > 0) {
      setMessages(conversationMessages);
      setCurrentConversationId(conversationMessages[0].conversation_id || null);
    }
  };

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 rounded-full p-4 bg-green-600 hover:bg-green-700 shadow-lg z-50"
        size="icon"
      >
        <div className="relative">
          <MessageSquare className="h-7 w-7" />
          <span className="absolute -top-2 -right-2 bg-white text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            AI
          </span>
        </div>
      </Button>

      {/* Chat History */}
      <ChatHistory
        user={user}
        onClose={() => setIsHistoryOpen(false)}
        onSelectConversation={loadConversation}
        isOpen={isHistoryOpen}
      />

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-96 sm:w-[450px] md:w-[500px] shadow-xl border-green-200 max-h-[650px] flex flex-col z-50">
          <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center">
            <CardTitle className="text-md flex items-center">
              <Bot className="h-6 w-6 mr-2 text-green-600" />
              Plant Care Assistant{" "}
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                AI Chatbot
              </span>
            </CardTitle>
            <div className="flex items-center gap-1">
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsHistoryOpen(true)}
                  className="h-8 w-8 text-gray-500 hover:text-green-600"
                  title="Chat History"
                >
                  <Clock className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                className="h-8 w-8 text-gray-500 hover:text-red-500"
                title="Clear Chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 min-h-[300px]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-gray-800 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-2 border-t">
            <div className="flex flex-col w-full space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Ask about plant care..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  disabled={!isPremium && messages.length > 2}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={
                    !input.trim() ||
                    isLoading ||
                    (!isPremium && messages.length > 2)
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center w-full">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-xs text-green-600 hover:text-green-700 flex items-center"
                >
                  <Upload className="h-3 w-3 mr-1" /> Upload photo
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            // Handle the image upload and start conversation
                            const base64Image = event.target.result.toString();
                            setInput(
                              "I've uploaded a plant photo. Can you identify it and provide care instructions?",
                            );
                            // You would need to modify your handleSendMessage function to handle images
                          }
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {!isPremium && messages.length > 2 && (
                  <p className="text-xs text-amber-600 text-right">
                    Upgrade to premium for unlimited AI assistant access
                  </p>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
