"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Leaf, Trash2, Search, Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { supabase } from "../../supabase/supabase";
import { useToast } from "./ui/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "./ui/dialog";

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
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        .eq("user_id", user?.id)
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

  const openPlantDetails = (plant: Plant) => {
    setSelectedPlant(plant);
    setIsDialogOpen(true);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          Sign in to view your plant collection
        </h2>
        <p className="text-gray-600 mb-6">
          Create an account to save and manage your identified plants with
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPlants.map((plant) => (
            <Card
              key={plant.id}
              className="overflow-hidden hover:shadow-md transition-shadow group relative"
            >
              <div
                className="relative h-40 cursor-pointer"
                onClick={() => openPlantDetails(plant)}
              >
                <img
                  src={plant.image_url}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center">
                  <MoreHorizontal className="text-white h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-bold text-sm truncate">{plant.name}</h3>
                <p className="text-xs text-gray-500 italic truncate">
                  {plant.scientific_name}
                </p>
              </CardContent>
              <CardFooter className="p-3 pt-0 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 py-1 h-auto"
                  asChild
                >
                  <a href={`/dashboard/plant/${plant.id}`}>Details</a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                  onClick={() => removePlant(plant.id)}
                  disabled={isDeleting === plant.id}
                >
                  {isDeleting === plant.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Plant Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedPlant?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={selectedPlant?.image_url}
                alt={selectedPlant?.name}
                className="w-full h-auto rounded-md"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedPlant?.name}</h3>
                <p className="text-sm text-gray-500 italic">
                  {selectedPlant?.scientific_name}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Identified on{" "}
                  {selectedPlant &&
                    new Date(selectedPlant.identified_at).toLocaleDateString()}
                </p>
              </div>

              {selectedPlant?.plant_data && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium">Water Needs</h4>
                    <p className="text-sm">
                      {selectedPlant.plant_data.waterNeeds}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Light Needs</h4>
                    <p className="text-sm">
                      {selectedPlant.plant_data.lightNeeds}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Soil Type</h4>
                    <p className="text-sm">
                      {selectedPlant.plant_data.soilType}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Growth Habit</h4>
                    <p className="text-sm">
                      {selectedPlant.plant_data.growthHabit}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Care Level</h4>
                    <p className="text-sm">
                      {selectedPlant.plant_data.careLevel}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  asChild
                >
                  <a href={`/dashboard/plant/${selectedPlant?.id}`}>
                    View Full Details
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
