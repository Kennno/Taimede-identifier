"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  Camera,
  Upload,
  X,
  Loader2,
  Save,
  Share2,
  AlertCircle,
  Leaf,
  Droplets,
  Sun,
  Sprout,
  Globe,
} from "lucide-react";
import AuthButton from "./auth-button";
import UpgradeButton from "./upgrade-button";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { identifyPlant, PlantInfo } from "@/lib/plant-ai";
import HealthStatus from "./health-status";
import { supabase } from "../../supabase/supabase";
import {
  getUserUsageCount,
  incrementUsageCount,
  canUserIdentifyMore,
  USAGE_LIMITS,
  getUserTier,
  trackDeviceUsage,
  syncDeviceUsageFromDB,
} from "@/lib/usage-limits";

export default function PlantIdentifier({
  user,
  isPremium = false,
}: {
  user: User | null;
  isPremium?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [canIdentify, setCanIdentify] = useState<boolean>(true);
  const [userTier, setUserTier] = useState<
    "unregistered" | "registered" | "premium"
  >("unregistered");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearImage = () => {
    setImage(null);
    setPlantInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const checkUsage = async () => {
      // First sync device usage from DB to ensure we have the latest count
      if (!user) {
        await syncDeviceUsageFromDB();
      }

      const tier = await getUserTier(user?.id, isPremium);
      const count = await getUserUsageCount(user?.id);
      const canIdentifyMore = await canUserIdentifyMore(user?.id, isPremium);

      setUserTier(tier);
      setUsageCount(count);
      setCanIdentify(canIdentifyMore);

      // Track device usage for better persistence
      if (!user) {
        await trackDeviceUsage(user?.id);
      }
    };

    checkUsage();
  }, [user, isPremium]);

  const handleIdentifyPlant = async () => {
    if (!image) return;

    if (!canIdentify) {
      toast({
        title: "Usage limit reached",
        description: user
          ? "You've reached your monthly identification limit. Please upgrade to Premium for unlimited identifications."
          : "You've reached the guest identification limit. Please sign up for more identifications.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPlantInfo(null);

    try {
      console.log("Starting plant identification...");
      const result = await identifyPlant(image, "en");
      console.log("Identification result:", result);
      setPlantInfo(result);

      // Increment usage count
      await incrementUsageCount(user?.id);

      // Update local state
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      const newCanIdentify =
        newCount < USAGE_LIMITS[userTier].maxIdentifications;
      setCanIdentify(newCanIdentify);

      // Save to recent searches if user is logged in
      if (user) {
        try {
          const { data, error } = await supabase
            .from("recent_searches")
            .insert({
              user_id: user.id,
              image_url: image,
              plant_name: result.name,
              scientific_name: result.scientificName,
              search_data: result,
              created_at: new Date().toISOString(),
            })
            .select();

          if (error) throw error;

          // You could update local state here if needed
          console.log("Search saved successfully", data);
        } catch (error) {
          console.error("Error saving search:", error);
        }
      }

      toast({
        title: "Plant identified",
        description: `Successfully identified as ${result.name}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error identifying plant:", error);
      toast({
        title: "Identification failed",
        description:
          "We couldn't identify this plant. Please try another image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePlant = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save plants to your collection",
        variant: "default",
      });
      return;
    }

    if (!plantInfo) return;

    setIsSaving(true);

    try {
      // Create a plant entry in the database
      const { error } = await supabase.from("plants").insert({
        user_id: user.id,
        name: plantInfo.name,
        scientific_name: plantInfo.scientificName,
        image_url: image,
        plant_data: plantInfo,
        identified_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Plant saved",
        description: "Plant has been added to your collection",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving plant:", error);
      toast({
        title: "Error",
        description: "Failed to save plant to your collection",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const shareResult = () => {
    if (!plantInfo) return;

    if (navigator.share) {
      navigator
        .share({
          title: `Plant Identified: ${plantInfo.name}`,
          text: `I identified ${plantInfo.name} (${plantInfo.scientificName}) using PlantID!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the Web Share API",
        variant: "default",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!image ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 transition-colors ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-green-100 rounded-full">
              <Upload className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">
              Drag & drop your plant photo here
            </h3>
            <p className="text-sm text-gray-500">or</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="mr-2 h-4 w-4" /> Browse Files
              </Button>
              <Button
                onClick={handleCameraClick}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Camera className="mr-2 h-4 w-4" /> Use Camera
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, WEBP
            </p>

            {/* Usage tracking display for all users */}
            <div className="mt-4 text-sm text-gray-600">
              <span
                className={`${canIdentify ? "text-green-600" : "text-amber-600"} font-medium`}
              >
                {usageCount} /{" "}
                {USAGE_LIMITS[userTier].maxIdentifications === Infinity
                  ? "∞"
                  : USAGE_LIMITS[userTier].maxIdentifications}{" "}
                identifications used
              </span>
            </div>
          </div>
        </div>
      ) : (
        <Card className="w-full overflow-hidden bg-white">
          <div className="relative">
            <img
              src={image}
              alt="Plant to identify"
              className="w-full h-auto max-h-96 object-contain bg-gray-50"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-green-600 animate-spin mb-4" />
                <p className="text-gray-600">Identifying your plant...</p>
              </div>
            ) : plantInfo ? (
              <div className="space-y-6">
                <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm">
                  <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-3">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {plantInfo.name}
                  </h3>
                  <p className="text-gray-600 italic text-lg">
                    {plantInfo.scientificName}
                  </p>
                </div>

                {plantInfo.description && (
                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500 shadow-sm">
                    <h4 className="font-medium text-lg mb-3 text-green-800">
                      About This Plant
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {plantInfo.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
                    <h4 className="text-lg font-medium mb-4 text-green-800 flex items-center">
                      <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                      Water & Light
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <Droplets className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Water Needs
                          </h5>
                          <p className="text-gray-700">
                            {plantInfo.waterNeeds}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-yellow-50 p-2 rounded-full mr-3">
                          <Sun className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Light Needs
                          </h5>
                          <p className="text-gray-700">
                            {plantInfo.lightNeeds}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
                    <h4 className="text-lg font-medium mb-4 text-green-800 flex items-center">
                      <Sprout className="h-5 w-5 mr-2 text-green-600" />
                      Growth & Care
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-green-50 p-2 rounded-full mr-3">
                          <Sprout className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Growth Habit
                          </h5>
                          <p className="text-gray-700">
                            {plantInfo.growthHabit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-amber-50 p-2 rounded-full mr-3">
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Care Level
                          </h5>
                          <p className="text-gray-700">{plantInfo.careLevel}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
                    <h4 className="text-lg font-medium mb-4 text-green-800 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-indigo-500" />
                      Origin & Habitat
                    </h4>
                    <div className="space-y-4">
                      {plantInfo.origin && (
                        <div className="flex items-start">
                          <div className="bg-indigo-50 p-2 rounded-full mr-3">
                            <Globe className="h-5 w-5 text-indigo-500" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">
                              Origin
                            </h5>
                            <p className="text-gray-700">{plantInfo.origin}</p>
                          </div>
                        </div>
                      )}
                      {plantInfo.habitat && (
                        <div className="flex items-start">
                          <div className="bg-teal-50 p-2 rounded-full mr-3">
                            <Leaf className="h-5 w-5 text-teal-500" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">
                              Natural Habitat
                            </h5>
                            <p className="text-gray-700">{plantInfo.habitat}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
                    <h4 className="text-lg font-medium mb-4 text-green-800 flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-green-600" />
                      Soil & Planting
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div
                          className="bg-brown-50 p-2 rounded-full mr-3"
                          style={{ backgroundColor: "#f5f0e6" }}
                        >
                          <Leaf className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Soil Type
                          </h5>
                          <p className="text-gray-700">{plantInfo.soilType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {plantInfo.healthStatus && (
                  <HealthStatus healthStatus={plantInfo.healthStatus} />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="flex gap-3 mb-4">
                  <Button
                    onClick={handleIdentifyPlant}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!canIdentify}
                  >
                    Identify Plant
                  </Button>
                  <Button
                    onClick={clearImage}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Try Different Image
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Click to analyze your plant image
                  </p>
                  {!canIdentify && (
                    <div className="flex items-center justify-center text-amber-600 mb-2">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Limit reached</span>
                    </div>
                  )}
                  {!user && usageCount > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      <AuthButton
                        mode="sign-up"
                        variant="link"
                        className="text-green-600 hover:underline p-0 h-auto font-normal"
                      >
                        Sign up
                      </AuthButton>{" "}
                      to get more identifications and save your plants!
                    </p>
                  )}
                  {user &&
                    !isPremium &&
                    usageCount >
                      USAGE_LIMITS.registered.maxIdentifications / 2 && (
                      <p className="mt-2 text-sm text-gray-600">
                        <UpgradeButton
                          userId={user.id}
                          variant="link"
                          className="text-green-600 hover:underline p-0 h-auto font-normal"
                        >
                          Upgrade to Premium
                        </UpgradeButton>{" "}
                        for unlimited identifications!
                      </p>
                    )}
                </div>
              </div>
            )}
          </CardContent>

          {plantInfo && (
            <CardFooter className="p-6 pt-0 flex flex-wrap gap-3 justify-center">
              {user ? (
                <Button
                  onClick={savePlant}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save to Collection
                    </>
                  )}
                </Button>
              ) : null}
              <Button
                onClick={shareResult}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                onClick={() => {
                  clearImage();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                <Camera className="mr-2 h-4 w-4" />
                Identify Another Plant
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
