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
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
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
    }
  }, [user, isOpen]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch conversations
      const { data: conversationsData, error: conversationsError } =
        await supabase
          .from("chat_conversations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

      if (conversationsError) throw conversationsError;

      // For each conversation, fetch messages
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
        title: "Error",
        description: "Failed to load chat history",
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
      // Delete messages first (foreign key constraint)
      const { error: messagesError } = await supabase
        .from("chat_messages")
        .delete()
        .eq("conversation_id", conversationToDelete);

      if (messagesError) throw messagesError;

      // Then delete the conversation
      const { error: conversationError } = await supabase
        .from("chat_conversations")
        .delete()
        .eq("id", conversationToDelete);

      if (conversationError) throw conversationError;

      // Update local state
      setConversations(
        conversations.filter((c) => c.id !== conversationToDelete),
      );

      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed",
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
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
      // Delete all messages for this user's conversations
      const conversationIds = conversations.map((c) => c.id);

      const { error: messagesError } = await supabase
        .from("chat_messages")
        .delete()
        .in("conversation_id", conversationIds);

      if (messagesError) throw messagesError;

      // Delete all conversations
      const { error: conversationsError } = await supabase
        .from("chat_conversations")
        .delete()
        .eq("user_id", user.id);

      if (conversationsError) throw conversationsError;

      // Update local state
      setConversations([]);

      toast({
        title: "All conversations deleted",
        description: "Your chat history has been cleared",
      });
    } catch (error) {
      console.error("Error deleting all conversations:", error);
      toast({
        title: "Error",
        description: "Failed to clear chat history",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed right-20 bottom-20 w-80 sm:w-96 shadow-xl border-green-200 max-h-[500px] flex flex-col z-50">
      <div className="py-3 px-4 border-b flex flex-row justify-between items-center bg-white sticky top-0">
        <div className="text-md flex items-center font-semibold">
          <Clock className="h-5 w-5 mr-2 text-green-600" />
          Chat History
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-grow p-3 max-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p>No chat history yet</p>
            <p className="text-sm mt-1">Your conversations will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-start"
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {conversation.title || "Conversation"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(conversation.created_at)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {conversation.messages.length > 0
                      ? conversation.messages[
                          conversation.messages.length - 1
                        ].content.substring(0, 50) +
                        (conversation.messages[conversation.messages.length - 1]
                          .content.length > 50
                          ? "..."
                          : "")
                      : "Empty conversation"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 -mt-1"
                  onClick={(e) => confirmDeleteConversation(conversation.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {conversations.length > 0 && (
        <div className="p-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={deleteAllConversations}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All History
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this conversation? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteConversation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
