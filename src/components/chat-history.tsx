"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Trash2, Clock, MessageSquare, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { supabase } from "../../supabase/supabase";
import { useToast } from "./ui/use-toast";

interface ChatMessage {
  id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  conversation_id: string;
  image_url?: string | null;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  message_count?: number;
  messages: ChatMessage[];
}

interface ChatHistoryProps {
  user: User | null;
  onClose: () => void;
  onSelectConversation?: (messages: ChatMessage[]) => void;
  isOpen: boolean;
}

export default function ChatHistory({
  user,
  onClose,
  onSelectConversation,
  isOpen,
}: ChatHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      fetchConversations();
      setupRealtimeSubscription();
    }

    return () => {
      supabase.channel("chat-changes").unsubscribe();
    };
  }, [user, isOpen]);

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel("chat-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_conversations",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            fetchConversations();
          } else if (payload.eventType === "DELETE") {
            setConversations((prev) =>
              prev.filter((conv) => conv.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const { data: conversationsData, error: conversationsError } =
        await supabase
          .from("chat_conversations")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

      if (conversationsError) throw conversationsError;

      const conversationsWithMessages = await Promise.all(
        (conversationsData || []).map(async (conversation) => {
          const { data: messagesData, error: messagesError } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("conversation_id", conversation.id)
            .order("created_at", { ascending: true });

          if (messagesError) throw messagesError;

          return {
            ...conversation,
            messages: messagesData || [],
          };
        }),
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      toast({
        title: "Viga",
        description: "Vestluste ajaloo laadimine ebaõnnestus",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (onSelectConversation) {
      onSelectConversation(conversation.messages);
    }
    onClose();
  };

  const confirmDeleteConversation = (
    conversationId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setConversationToDelete(conversationId);
    setIsDeleteDialogOpen(true);
  };

  const deleteConversation = async () => {
    if (!conversationToDelete) return;

    try {
      const { error: messagesError } = await supabase
        .from("chat_messages")
        .delete()
        .eq("conversation_id", conversationToDelete);

      if (messagesError) throw messagesError;

      const { error: conversationError } = await supabase
        .from("chat_conversations")
        .delete()
        .eq("id", conversationToDelete);

      if (conversationError) throw conversationError;

      setConversations(
        conversations.filter((c) => c.id !== conversationToDelete),
      );

      toast({
        title: "Vestlus kustutatud",
        description: "Vestlus on eemaldatud",
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Viga",
        description: "Vestluse kustutamine ebaõnnestus",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const deleteAllConversations = async () => {
    if (!user || conversations.length === 0) return;

    try {
      const conversationIds = conversations.map((c) => c.id);

      const { error: messagesError } = await supabase
        .from("chat_messages")
        .delete()
        .in("conversation_id", conversationIds);

      if (messagesError) throw messagesError;

      const { error: conversationsError } = await supabase
        .from("chat_conversations")
        .delete()
        .eq("user_id", user.id);

      if (conversationsError) throw conversationsError;

      setConversations([]);

      toast({
        title: "Kõik vestlused kustutatud",
        description: "Sinu vestluste ajalugu on tühjendatud",
      });
    } catch (error) {
      console.error("Error deleting all conversations:", error);
      toast({
        title: "Viga",
        description: "Vestluste ajaloo tühjendamine ebaõnnestus",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("et-EE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <Card className="absolute right-0 bottom-0 w-80 sm:w-96 shadow-xl border-gray-800 max-h-[500px] flex flex-col bg-gray-950 text-white">
      <div className="py-3 px-4 border-b border-gray-800 flex flex-row justify-between items-center bg-gray-950 sticky top-0">
        <div className="text-md flex items-center font-semibold text-white">
          <Clock className="h-5 w-5 mr-2 text-green-400" />
          Vestluste ajalugu
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-grow p-3 max-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-600" />
            <p>Vestluste ajalugu puudub</p>
            <p className="text-sm mt-1">Sinu vestlused ilmuvad siia</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-3 border border-gray-800 rounded-md hover:bg-gray-900 cursor-pointer flex justify-between items-start"
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {conversation.title || "Vestlus"}
                  </p>
                  {conversation.last_message && (
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {conversation.last_message.length > 60
                        ? conversation.last_message.substring(0, 60) + "..."
                        : conversation.last_message}
                    </p>
                  )}
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-gray-500">
                      {formatDate(
                        conversation.updated_at || conversation.created_at,
                      )}
                    </p>
                    {conversation.message_count > 0 && (
                      <span className="ml-2 text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded-full">
                        {conversation.message_count} sõnumit
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => confirmDeleteConversation(conversation.id, e)}
                  className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-gray-800 -mt-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {conversations.length > 0 && (
        <div className="p-3 border-t border-gray-800">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-400 hover:bg-gray-800 hover:text-red-300 border-gray-700"
            onClick={deleteAllConversations}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Kustuta kogu ajalugu
          </Button>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-950 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Kustuta vestlus</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">
            Kas oled kindel, et soovid selle vestluse kustutada? Seda tegevust
            ei saa tagasi võtta.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Tühista
            </Button>
            <Button
              variant="destructive"
              onClick={deleteConversation}
              className="bg-red-900 hover:bg-red-800 text-white"
            >
              Kustuta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
