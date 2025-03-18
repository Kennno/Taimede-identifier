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
  Save,
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

// Helper to store chat session in localStorage for non-logged in users
const SESSION_STORAGE_KEY = "plant-ai-chat-session";

const saveSessionToLocalStorage = (
  messages: Message[],
  conversationId: string | null,
) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        messages,
        conversationId,
        timestamp: new Date().toISOString(),
      }),
    );
  }
};

const getSessionFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        // Check if session is less than 24 hours old
        const timestamp = new Date(parsedSession.timestamp);
        const now = new Date();
        const hoursDiff =
          (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          return parsedSession;
        }
      } catch (e) {
        console.error("Error parsing chat session from localStorage", e);
      }
    }
  }
  return null;
};

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
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial data loading
  useEffect(() => {
    if (!hasLoadedInitialData && isOpen) {
      if (user) {
        // For logged in users, load from database
        loadChatHistory();
      } else {
        // For non-logged in users, try to load from localStorage
        const savedSession = getSessionFromLocalStorage();
        if (savedSession && savedSession.messages.length > 0) {
          setMessages(savedSession.messages);
          setCurrentConversationId(savedSession.conversationId);
          setIsHistoryOpen(false);
        } else {
          // If no saved session, show initial greeting
          setIsHistoryOpen(false);
        }
      }
      setHasLoadedInitialData(true);
    }
  }, [isOpen, user, hasLoadedInitialData]);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0 && !isHistoryOpen && hasLoadedInitialData) {
      const greeting = isPremium
        ? "Tere! Rõõm sind näha! Mina olen sinu isiklik taimeabi assistent. Milliste taimeküsimustega saan sind täna aidata? 😊"
        : "Tere! Olen sinu taimede hoolduse assistent. Saan vastata mõnele küsimusele tasuta, või saad uuendada premium-kontole piiramatu taimeabi saamiseks.";

      setMessages([
        {
          role: "assistant",
          content: greeting,
        },
      ]);
    }
  }, [isPremium, isHistoryOpen, messages.length, hasLoadedInitialData]);

  // Save session to localStorage for non-logged in users
  useEffect(() => {
    if (!user && messages.length > 0) {
      saveSessionToLocalStorage(messages, currentConversationId);
    }
  }, [messages, currentConversationId, user]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set up realtime subscription for messages
  useEffect(() => {
    if (user && currentConversationId) {
      const channel = supabase
        .channel("chat-messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `conversation_id=eq.${currentConversationId}`,
          },
          (payload) => {
            // Only add the message if it's not already in the messages array
            const newMessage = payload.new as Message;
            setMessages((prev) => {
              if (!prev.some((msg) => msg.id === newMessage.id)) {
                return [...prev, newMessage];
              }
              return prev;
            });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "chat_conversations",
            filter: `id=eq.${currentConversationId}`,
          },
          () => {
            // If the conversation was deleted, clear the messages
            setMessages([]);
            setCurrentConversationId(null);
          },
        )
        .subscribe();

      return () => {
        supabase.channel("chat-messages").unsubscribe();
      };
    }
  }, [user, currentConversationId]);

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
        .order("updated_at", { ascending: false });

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
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: message.role,
          content: message.content,
          image_url: message.image_url,
        })
        .select();

      if (error) throw error;

      // Return the saved message with its ID
      return data?.[0];
    } catch (error) {
      console.error("Error saving message:", error);
      return null;
    }
  };

  const createNewConversation = async (firstMessage?: Message) => {
    if (!user) return null;

    try {
      const conversationId = uuidv4();
      const title =
        firstMessage && firstMessage.role === "user"
          ? firstMessage.content.substring(0, 50) +
            (firstMessage.content.length > 50 ? "..." : "")
          : "Uus vestlus";

      const { error } = await supabase.from("chat_conversations").insert({
        id: conversationId,
        user_id: user.id,
        title: title,
        last_message: firstMessage?.content || null,
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

        // Upload image to storage if user is logged in
        if (user) {
          const fileName = `${user.id}/${Date.now()}-${imageUpload.name}`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("chat_images")
              .upload(fileName, imageUpload);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("chat_images")
            .getPublicUrl(fileName);

          imageUrl = urlData.publicUrl;
        }
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    // Create user message
    const userMessage: Message = {
      role: "user" as const,
      content:
        input ||
        "Ma laadisin üles pildi taimest. Kas sa saaksid seda tuvastada ja anda näpunäiteid selle hooldamisest?",
      image_url: imageUrl,
    };

    // Create a new conversation if needed for logged in users
    if (!currentConversationId && user) {
      const newConversationId = await createNewConversation(userMessage);
      setCurrentConversationId(newConversationId);

      // If we have a conversation ID, save the message
      if (newConversationId) {
        const savedMessage = await saveMessageToDatabase(
          userMessage,
          newConversationId,
        );
        if (savedMessage) {
          userMessage.id = savedMessage.id;
          userMessage.created_at = savedMessage.created_at;
          userMessage.conversation_id = newConversationId;
        }
      }
    } else if (currentConversationId && user) {
      // Save message to existing conversation
      const savedMessage = await saveMessageToDatabase(
        userMessage,
        currentConversationId,
      );
      if (savedMessage) {
        userMessage.id = savedMessage.id;
        userMessage.created_at = savedMessage.created_at;
        userMessage.conversation_id = currentConversationId;
      }
    }

    // Add user message to UI
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImageUpload(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      // Prepare context for the AI
      let contextPrompt = "";

      // Include previous messages as context (last 10 messages)
      const contextMessages = messages.slice(-10);
      if (contextMessages.length > 0) {
        contextPrompt = "Eelnevad sõnumid vestluses:\n";
        contextMessages.forEach((msg) => {
          contextPrompt += `${msg.role === "user" ? "Kasutaja" : "Assistent"}: ${msg.content}\n`;
        });
        contextPrompt +=
          "\nVasta kasutaja viimasele küsimusele, võttes arvesse eelnevat vestlust:\n";
      }

      // Call Gemini API for plant care advice
      const userQuery = contextPrompt + input;

      // Determine if we should analyze the image or just respond to text
      let response;
      if (base64Image) {
        // If there's an image, use it for plant identification
        response = await identifyPlantWithGemini(
          base64Image,
          "et",
          input ? userQuery : "", // If there's text, include it as context
        );
      } else {
        // Text-only query
        response = await identifyPlantWithGemini("", "et", userQuery);
      }

      // Create assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content:
          response.response ||
          (base64Image && !input
            ? // If it's an image-only query with no text, format the plant info nicely
              `**Taim tuvastatud:** ${response.name} (${response.scientificName})\n\n` +
              `${response.description || ""}\n\n` +
              `**Kastmine:** ${response.waterNeeds}\n` +
              `**Valgus:** ${response.lightNeeds}\n` +
              `**Muld:** ${response.soilType}\n` +
              `**Kasvuviis:** ${response.growthHabit}\n` +
              `**Hoolduse tase:** ${response.careLevel}`
            : // Default fallback
              "Ma ei ole kindel kuidas sellele vastata. Kas saaksid küsida teistmoodi?"),
      };

      // Save assistant message to database if logged in
      if (user && currentConversationId) {
        const savedMessage = await saveMessageToDatabase(
          assistantMessage,
          currentConversationId,
        );
        if (savedMessage) {
          assistantMessage.id = savedMessage.id;
          assistantMessage.created_at = savedMessage.created_at;
          assistantMessage.conversation_id = currentConversationId;
        }
      }

      // Add assistant response to UI
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage =
        "Vabandust, tekkis viga. Palun proovi hiljem uuesti.";

      const errorAssistantMessage: Message = {
        role: "assistant",
        content: errorMessage,
      };

      // Save error message to database if logged in
      if (user && currentConversationId) {
        await saveMessageToDatabase(
          errorAssistantMessage,
          currentConversationId,
        );
      }

      setMessages((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: isPremium
          ? "Tere! Olen sinu taimede hoolduse assistent. Küsi minult ükskõik mida oma taimede kohta ja aitan sul nende eest hoolitseda. Kuidas saan sind täna aidata?"
          : "Tere! Olen sinu taimede hoolduse assistent. Uuenda premium-kontole, et saada piiramatu juurdepääs taimede hoolduse nõuannetele.",
      },
    ]);
    setCurrentConversationId(null);

    // Clear local storage session for non-logged in users
    if (!user && typeof window !== "undefined") {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
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
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("Palun lae üles pilt väiksem kui 10MB!");
        return;
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Palun lae üles ainult JPG, PNG, GIF või WEBP formaadis pilt!");
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
          'input[placeholder="Küsi taimede hoolduse kohta..."]',
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

  const saveConversation = async () => {
    // Only for non-logged in users who want to save their conversation
    if (user || messages.length === 0) return;

    try {
      setIsLoading(true);

      // Create a new conversation
      const conversationId = await createNewConversation(messages[0]);
      if (!conversationId) throw new Error("Failed to create conversation");

      // Save all messages to the database
      for (const message of messages) {
        await saveMessageToDatabase(message, conversationId);
      }

      setCurrentConversationId(conversationId);
      alert("Vestlus on salvestatud! Kui soovid seda hiljem näha, logi sisse.");
    } catch (error) {
      console.error("Error saving conversation:", error);
      alert("Vabandust, vestluse salvestamisel tekkis viga.");
    } finally {
      setIsLoading(false);
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
          <span className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
              Hiljutised vestlused
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={startNewChat}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Uus vestlus
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
              Taimede hoolduse abiline{" "}
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                AI Vestlusrobot
              </span>
            </CardTitle>
            <div className="flex items-center gap-1">
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsHistoryOpen(true)}
                  className="h-8 w-8 text-gray-500 hover:text-green-600"
                  title="Vestluste ajalugu"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {!user && messages.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveConversation}
                  className="h-8 w-8 text-gray-500 hover:text-green-600"
                  title="Salvesta vestlus"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                className="h-8 w-8 text-gray-500 hover:text-red-500"
                title="Puhasta vestlus"
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
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 min-h-[300px] bg-white dark:bg-gray-900">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${message.role === "user" ? "bg-green-600 text-white" : "bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}
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
                  Mõtlen...
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
                <div className="relative flex-1">
                  <Input
                    placeholder="Küsi taimede hoolduse kohta..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isLoading}
                    className="bg-white dark:bg-gray-800 pr-10"
                  />
                  <label
                    htmlFor="file-upload"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                  >
                    <Upload className="h-5 w-5" />
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      capture="environment"
                    />
                  </label>
                </div>
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={(!input.trim() && !imageUpload) || isLoading}
                  className="bg-green-600 hover:bg-green-700 flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex justify-end items-center w-full">
                {!user && (
                  <p className="text-xs text-gray-500">
                    Vestlus säilib 24h või kuni brauseri sulgemiseni
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
