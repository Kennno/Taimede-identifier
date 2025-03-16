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
  Upload,
  ArrowLeft,
  Plus,
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
  image_url?: string | null;
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
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0 && !isHistoryOpen) {
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
  }, [isPremium, isHistoryOpen, messages.length]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history when component mounts
  useEffect(() => {
    if (user && isOpen) {
      loadChatHistory();
    }
  }, [user, isOpen]);

  // Handle file input changes
  useEffect(() => {
    if (fileInputRef.current) {
      const fileInput = fileInputRef.current;
      const handleChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
          handleImageUpload({
            target: { files: input.files },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      };

      fileInput.addEventListener("change", handleChange);
      return () => {
        fileInput.removeEventListener("change", handleChange);
      };
    }
  }, []);

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // If there are no conversations, start a new one
      if (!data || data.length === 0) {
        setIsHistoryOpen(false);
        return;
      }

      // If there are conversations, show the history view
      setIsHistoryOpen(true);
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        image_url: message.image_url,
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
    if ((!input.trim() && !imageUpload) || isLoading) return;

    // Create a new conversation if needed
    if (!currentConversationId && user) {
      const newConversationId = await createNewConversation();
      setCurrentConversationId(newConversationId);
    }

    // Process image if present
    let base64Image = "";
    let imageUrl = null;
    if (imageUpload) {
      try {
        // Convert image to base64 for API
        const reader = new FileReader();
        base64Image = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imageUpload);
        });

        // Upload image to storage
        const fileName = `${user?.id || "anonymous"}/${Date.now()}-${imageUpload.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("chat_images")
          .upload(fileName, imageUpload);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("chat_images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    // Add user message
    const userMessage: Message = {
      role: "user" as const,
      content:
        input ||
        "I've uploaded a plant photo. Can you identify it and provide care instructions?",
      image_url: imageUrl,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImageUpload(null);
    setImagePreview(null);
    setIsLoading(true);

    // Save user message to database if logged in
    if (user && currentConversationId) {
      await saveMessageToDatabase(userMessage, currentConversationId);
    }

    try {
      // Call Gemini API for plant care advice
      const userQuery = input;

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
      setIsHistoryOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Please upload an image smaller than 5MB");
        return;
      }

      setImageUpload(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Focus on input after uploading
      setTimeout(() => {
        const inputElement = document.querySelector(
          'input[placeholder="Ask about plant care..."]',
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        }
      }, 100);
    }
  };

  const removeImage = () => {
    setImageUpload(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setIsHistoryOpen(false);
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
      {isOpen && isHistoryOpen && (
        <Card className="fixed bottom-20 right-4 w-96 sm:w-[450px] md:w-[500px] shadow-xl border-green-200 max-h-[650px] flex flex-col z-50">
          <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center">
            <CardTitle className="text-md flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              Recent Conversations
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={startNewChat}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Chat
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
          <CardContent className="flex-grow overflow-y-auto p-0">
            <ChatHistory
              user={user}
              onClose={() => setIsHistoryOpen(false)}
              onSelectConversation={loadConversation}
              isOpen={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Chat window */}
      {isOpen && !isHistoryOpen && (
        <Card className="fixed bottom-20 right-4 w-96 sm:w-[450px] md:w-[500px] shadow-xl border-green-200 max-h-[650px] flex flex-col z-50 bg-white dark:bg-gray-900">
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
                  <ArrowLeft className="h-4 w-4" />
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
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}
                >
                  {message.image_url && (
                    <div className="mb-2">
                      <img
                        src={message.image_url}
                        alt="Uploaded plant"
                        className="max-w-full rounded-md"
                      />
                    </div>
                  )}
                  {message.content}
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {message.created_at
                      ? new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-2 border-t">
            <div className="flex flex-col w-full space-y-2">
              {imagePreview && (
                <div className="relative border rounded-md p-1 bg-gray-50 dark:bg-gray-800">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-20 w-auto mx-auto rounded"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Ask about plant care..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="bg-white dark:bg-gray-800"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={(!input.trim() && !imageUpload) || isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
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
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
