"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { History, Search, Loader2, X, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { supabase } from "../../supabase/supabase";
import { useToast } from "./ui/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "./ui/dialog";

interface RecentSearch {
  id: string;
  plant_name: string;
  scientific_name: string;
  image_url: string;
  created_at: string;
  search_data?: any;
}

interface RecentSearchesProps {
  user: User | null;
}

export default function RecentSearches({ user }: RecentSearchesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSearch, setSelectedSearch] = useState<RecentSearch | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

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

  const openSearchDetails = (search: RecentSearch) => {
    setSelectedSearch(search);
    setIsDialogOpen(true);
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
          Create an account to save your plant identification history with
          RoheAI.
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredSearches.map((search) => (
            <Card
              key={search.id}
              className="overflow-hidden hover:shadow-md transition-shadow group relative"
            >
              <div
                className="relative h-32 cursor-pointer"
                onClick={() => openSearchDetails(search)}
              >
                <img
                  src={search.image_url}
                  alt={search.plant_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center">
                  <MoreHorizontal className="text-white h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white/90 rounded-full h-5 w-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSearch(search.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <CardContent className="p-3">
                <h3 className="font-bold text-sm truncate">
                  {search.plant_name}
                </h3>
                <p className="text-xs text-gray-500 italic truncate">
                  {search.scientific_name}
                </p>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {new Date(search.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedSearch?.plant_name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={selectedSearch?.image_url}
                alt={selectedSearch?.plant_name}
                className="w-full h-auto rounded-md"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedSearch?.plant_name}
                </h3>
                <p className="text-sm text-gray-500 italic">
                  {selectedSearch?.scientific_name}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Searched on{" "}
                  {selectedSearch &&
                    new Date(selectedSearch.created_at).toLocaleDateString()}
                </p>
              </div>

              {selectedSearch?.search_data && (
                <div className="space-y-3">
                  {selectedSearch.search_data.description && (
                    <div>
                      <h4 className="text-sm font-medium">Description</h4>
                      <p className="text-sm">
                        {selectedSearch.search_data.description}
                      </p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium">Water Needs</h4>
                    <p className="text-sm">
                      {selectedSearch.search_data.waterNeeds}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Light Needs</h4>
                    <p className="text-sm">
                      {selectedSearch.search_data.lightNeeds}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Soil Type</h4>
                    <p className="text-sm">
                      {selectedSearch.search_data.soilType}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Growth Habit</h4>
                    <p className="text-sm">
                      {selectedSearch.search_data.growthHabit}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Care Level</h4>
                    <p className="text-sm">
                      {selectedSearch.search_data.careLevel}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  asChild
                >
                  <a href="/">Identify Similar Plant</a>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
