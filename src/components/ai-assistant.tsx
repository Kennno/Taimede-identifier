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
import { MessageSquare, Send, Loader2, Bot, X } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { identifyPlantWithGemini } from "@/lib/gemini";
import { supabase } from "../../supabase/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  user: User | null;
  isPremium?: boolean;
}

export default function AIAssistant({
  user,
  isPremium = false,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your plant care assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversation history from localStorage on component mount
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const savedMessages = localStorage.getItem(`chat_history_${user.id}`);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        } catch (e) {
          console.error("Error parsing saved messages:", e);
        }
      }
    }
  }, [user]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 1 && typeof window !== "undefined") {
      localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (isPremium) {
        // Use Gemini API for premium users
        const prompt = `You are a plant care assistant that ONLY answers questions about plants, gardening, and plant care. 
        If the user asks about anything unrelated to plants, politely redirect them to ask about plants instead.
        Never share any information about how you're implemented, your API keys, or the website's code or data.
        
        User question: ${input.trim()}
        
        Provide a helpful, detailed response about plant care. If the question is not about plants, politely explain that you can only answer plant-related questions.`;

        // Convert prompt to base64 to use with the image API (without an image)
        const base64Prompt = btoa(prompt);

        // Call Gemini API
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=AIzaSyDF2bvq7-PRlcI6p-9upQq4LDQ6sFcx2Fk`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 32,
                topP: 1,
                maxOutputTokens: 2048,
              },
            }),
          },
        );

        const data = await response.json();
        let aiResponse =
          "I'm sorry, I couldn't process your request at the moment.";

        if (
          data.candidates &&
          data.candidates[0] &&
          data.candidates[0].content
        ) {
          aiResponse = data.candidates[0].content.parts[0].text;
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiResponse },
        ]);
      } else {
        // Non-premium users get basic responses
        const response =
          "As a premium feature, I can provide detailed plant care advice tailored to your specific needs. Upgrade to our Premium plan to unlock unlimited access to personalized plant care assistance!";

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your request. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 bg-green-600 hover:bg-green-700 shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 z-50">
      <Card className="shadow-xl border-green-200">
        <CardHeader className="pb-3 bg-green-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-base">Plant Care Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full text-white hover:bg-green-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-green-100 text-gray-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="p-3 border-t">
          {isPremium ? (
            <div className="flex w-full gap-2">
              <Input
                placeholder="Type your plant care question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : (
            <div className="w-full text-center">
              <p className="text-sm text-gray-600 mb-2">
                Upgrade to Premium for personalized plant care advice
              </p>
              <Button
                className="bg-green-600 hover:bg-green-700 w-full"
                asChild
              >
                <a href={user ? "/pricing" : "/sign-up"}>Upgrade Now</a>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
