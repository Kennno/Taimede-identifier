"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Leaf, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { supabase } from "../../supabase/supabase";
import { useToast } from "./ui/use-toast";

interface Plant {
  id: string;
  name: string;
  scientific_name: string;
  image_url: string;
  identified_at: string;
  plant_data: any;
}

interface PlantCollectionProps {
  user: User | null;
}

export default function PlantCollection({ user }: PlantCollectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPlants();
    } else {
      setPlants([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchPlants = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("plants")
        .select("*")
        .order("identified_at", { ascending: false });

      if (error) throw error;
      setPlants(data || []);
    } catch (error) {
      console.error("Error fetching plants:", error);
      toast({
        title: "Error",
        description: "Failed to load your plant collection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlants = plants.filter(
    (plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const removePlant = async (id: string) => {
    try {
      setIsDeleting(id);
      const { error } = await supabase.from("plants").delete().eq("id", id);

      if (error) throw error;

      setPlants(plants.filter((plant) => plant.id !== id));
      toast({
        title: "Plant removed",
        description: "Plant has been removed from your collection",
        variant: "default",
      });
    } catch (error) {
      console.error("Error removing plant:", error);
      toast({
        title: "Error",
        description: "Failed to remove plant from your collection",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          Sign in to view your plant collection
        </h2>
        <p className="text-gray-600 mb-6">
          Create an account to save and manage your identified plants.
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
        <p>Loading your plant collection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">My Plant Collection</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredPlants.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {searchTerm ? (
            <>
              <h3 className="text-xl font-medium mb-2">No plants found</h3>
              <p className="text-gray-500">Try a different search term</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-medium mb-2">
                Your collection is empty
              </h3>
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
          {filteredPlants.map((plant) => (
            <Card
              key={plant.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={plant.image_url}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{plant.name}</h3>
                <p className="text-sm text-gray-500 italic">
                  {plant.scientific_name}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Identified on{" "}
                  {new Date(plant.identified_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/dashboard/plant/${plant.id}`}>View Details</a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removePlant(plant.id)}
                  disabled={isDeleting === plant.id}
                >
                  {isDeleting === plant.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
