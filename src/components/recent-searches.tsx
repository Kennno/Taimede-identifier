"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { History, Search, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { supabase } from "../../supabase/supabase";
import { useToast } from "./ui/use-toast";

interface RecentSearch {
  id: string;
  plant_name: string;
  scientific_name: string;
  image_url: string;
  created_at: string;
}

interface RecentSearchesProps {
  user: User | null;
}

export default function RecentSearches({ user }: RecentSearchesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchRecentSearches();
    } else {
      setSearches([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchRecentSearches = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("recent_searches")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setSearches(data || []);
    } catch (error) {
      console.error("Error fetching recent searches:", error);
      toast({
        title: "Error",
        description: "Failed to load your recent searches",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = async (id: string) => {
    try {
      const { error } = await supabase
        .from("recent_searches")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSearches(searches.filter((search) => search.id !== id));
    } catch (error) {
      console.error("Error removing search:", error);
      toast({
        title: "Error",
        description: "Failed to remove search from history",
        variant: "destructive",
      });
    }
  };

  const clearAllSearches = async () => {
    try {
      const { error } = await supabase
        .from("recent_searches")
        .delete()
        .eq("user_id", user?.id);

      if (error) throw error;

      setSearches([]);
      toast({
        title: "History cleared",
        description: "All search history has been cleared",
        variant: "default",
      });
    } catch (error) {
      console.error("Error clearing search history:", error);
      toast({
        title: "Error",
        description: "Failed to clear search history",
        variant: "destructive",
      });
    }
  };

  const filteredSearches = searches.filter(
    (search) =>
      search.plant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      search.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user) {
    return (
      <div className="text-center py-12">
        <History className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          Sign in to view your search history
        </h2>
        <p className="text-gray-600 mb-6">
          Create an account to save your plant identification history.
        </p>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <a href="/sign-in">Sign In</a>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin mr-2" />
        <p>Loading your recent searches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Recent Searches</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Filter history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searches.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllSearches}
              className="whitespace-nowrap"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {filteredSearches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {searchTerm ? (
            <>
              <h3 className="text-xl font-medium mb-2">No searches found</h3>
              <p className="text-gray-500">Try a different search term</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-medium mb-2">No recent searches</h3>
              <p className="text-gray-500 mb-6">
                Identify your first plant to get started
              </p>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <a href="/">Identify a Plant</a>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSearches.map((search) => (
            <Card
              key={search.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={search.image_url}
                  alt={search.plant_name}
                  className="w-full h-40 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full h-6 w-6"
                  onClick={() => clearSearch(search.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{search.plant_name}</h3>
                <p className="text-sm text-gray-500 italic">
                  {search.scientific_name}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Searched on {new Date(search.created_at).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-green-600 border-green-600 hover:bg-green-50"
                    asChild
                  >
                    <a href="/">Identify Similar Plant</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
