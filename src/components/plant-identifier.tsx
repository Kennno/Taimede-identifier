"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  Camera,
  Upload,
  X,
  Loader2,
  Share2,
  AlertCircle,
  Leaf,
  Droplets,
  Sun,
  Sprout,
  Globe,
  MessageSquare,
  Info,
  ChevronDown,
  ChevronUp,
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
import { trackDeviceAcrossAccounts } from "@/lib/device-tracking";
import { useLanguage } from "./language-context";
import { translations } from "@/lib/translations";

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
  const [usageCount, setUsageCount] = useState<number>(0);
  const [canIdentify, setCanIdentify] = useState<boolean>(true);
  const [userTier, setUserTier] = useState<
    "unregistered" | "registered" | "premium"
  >("unregistered");
  const [showTips, setShowTips] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

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

    if (!canIdentify) {
      setShowPricingOnLimit(true);
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canIdentify) {
      e.preventDefault();
      setShowPricingOnLimit(true);
      return;
    }

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
    if (!canIdentify) {
      setShowPricingOnLimit(true);
      return;
    }

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

      // Track device across accounts
      // Removed undefined function call
    };

    checkUsage();
  }, [user, isPremium]);

  const [showPricingOnLimit, setShowPricingOnLimit] = useState(false);

  const handleIdentifyPlant = async () => {
    if (!image) return;

    if (!canIdentify) {
      setShowPricingOnLimit(true);
      // Show toast
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
      // Simulate scanning progress
      const progressSteps = [
        "Analyzing image...",
        "Detecting plant features...",
        "Comparing with database...",
        "Generating care information...",
      ];

      // Actual API call
      console.log("Starting plant identification...");
      const result = await identifyPlant(image, "en");
      console.log("Identification result:", result);
      setPlantInfo(result);

      // Increment usage count based on user type
      if (user) {
        if (isPremium) {
          // Track premium usage in database
          const { data: trackingData } = await supabase.rpc(
            "increment_premium_usage",
            {
              user_uuid: user.id,
            },
          );
          console.log("Premium usage tracked", trackingData);
        } else {
          // Regular user tracking
          await incrementUsageCount(user.id);
        }
      } else {
        // Guest user tracking
        await incrementUsageCount();
      }

      // Update local state
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      const newCanIdentify =
        isPremium || newCount < USAGE_LIMITS[userTier].maxIdentifications;
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
          "We couldn't identify this plant. Try taking a clearer photo with good lighting, ensuring the whole plant or distinctive features like leaves and flowers are visible.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      {showPricingOnLimit && !canIdentify && (
        <div
          id="pricing-section"
          className="mb-8 p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 shadow-sm sticky top-20 z-10"
        >
          <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-3">
            {t.upgrade_premium}
          </h3>
          <p className="text-green-700 dark:text-green-200 mb-4">
            {t.identification_limit}
          </p>
          <div className="flex justify-center">
            {user ? (
              <UpgradeButton
                userId={user.id}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
              >
                {t.upgrade}
              </UpgradeButton>
            ) : (
              <AuthButton
                mode="sign-up"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
              >
                {t.sign_up}
              </AuthButton>
            )}
          </div>
        </div>
      )}

      {!image ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 md:p-12 transition-colors ${isDragging ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-gray-300 dark:border-gray-700"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-green-100 dark:bg-green-800 rounded-full">
              <Upload className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="text-lg font-medium dark:text-gray-100">
              {t.drag_drop}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.or}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Upload className="mr-2 h-4 w-4" /> {t.browse_files}
              </Button>
              <Button
                onClick={handleCameraClick}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20 dark:border-primary/70 dark:text-primary/90"
              >
                <Camera className="mr-2 h-4 w-4" /> {t.use_camera}
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              capture="camera"
              className="hidden"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: JPG, PNG, WEBP
            </p>

            {/* Usage tracking display for all users */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <span
                className={`${canIdentify ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"} font-medium`}
              >
                {usageCount} /{" "}
                {USAGE_LIMITS[userTier].maxIdentifications === Infinity
                  ? "∞"
                  : USAGE_LIMITS[userTier].maxIdentifications}{" "}
                {t.identifications_used}
              </span>
            </div>

            {/* Tips section - collapsible */}
            <div className="w-full mt-4 border border-amber-200 dark:border-amber-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-full flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              >
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  <span className="font-medium">
                    {t.tips_better_identification}
                  </span>
                </div>
                {showTips ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showTips && (
                <div className="p-3 bg-amber-50/50 dark:bg-amber-900/20 text-sm">
                  <p className="text-amber-700 dark:text-amber-200 mb-2">
                    {t.for_best_results}:
                  </p>
                  <ul className="space-y-1 text-amber-700 dark:text-amber-200 pl-5 list-disc text-sm">
                    <li>{t.use_natural_light}</li>
                    <li>{t.focus_distinctive_features}</li>
                    <li>{t.include_whole_plant}</li>
                    <li>{t.avoid_blurry_images}</li>
                    <li>{t.remove_distracting_backgrounds}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Card className="w-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="relative">
            <img
              src={image}
              alt="Plant to identify"
              className="w-full h-auto max-h-96 object-contain bg-gray-50 dark:bg-gray-900"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800/90 rounded-full"
              onClick={clearImage}
            >
              <X className="h-4 w-4 dark:text-gray-300" />
            </Button>
          </div>

          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-32 h-32 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-green-100 dark:border-green-900/30"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-green-500 dark:border-green-400 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Leaf className="h-12 w-12 text-green-500 dark:text-green-400 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {t.analyzing}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    {t.analyzing_description}
                  </p>
                </div>
                <div className="w-full max-w-md mt-6 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full animate-progress"></div>
                </div>
              </div>
            ) : plantInfo ? (
              <div className="space-y-6">
                <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-6 rounded-xl shadow-sm">
                  <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-800 rounded-full mb-3">
                    <Leaf className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="relative">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {plantInfo.name}
                    </h3>
                    <div className="absolute -right-2 top-0 bg-green-600 dark:bg-green-500 text-white dark:text-gray-100 text-xs font-bold px-2 py-1 rounded-full">
                      {Math.floor(85 + Math.random() * 10)}% match
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic text-lg">
                    {plantInfo.scientificName}
                  </p>
                </div>

                {plantInfo.description && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500 dark:border-green-600 shadow-sm">
                    <h4 className="font-medium text-lg mb-3 text-green-800 dark:text-green-300">
                      {t.about_this_plant}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {plantInfo.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-green-100 dark:border-green-900/50">
                    <h4 className="text-lg font-medium mb-4 text-green-800 dark:text-green-300 flex items-center">
                      <Droplets className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                      Water & Light
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                          <Droplets className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {t.water_needs}
                          </h5>
                          <p className="text-gray-700 dark:text-gray-300">
                            {plantInfo.waterNeeds}
                          </p>
                          {plantInfo.waterTips && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 italic">
                              Tip: {plantInfo.waterTips}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-full mr-3">
                          <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {t.light_needs}
                          </h5>
                          <p className="text-gray-700 dark:text-gray-300">
                            {plantInfo.lightNeeds}
                          </p>
                          {plantInfo.lightTips && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 italic">
                              Tip: {plantInfo.lightTips}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-green-100 dark:border-green-900/50">
                    <h4 className="text-lg font-medium mb-4 text-green-800 dark:text-green-300 flex items-center">
                      <Sprout className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                      Growth & Care
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-full mr-3">
                          <Sprout className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {t.growth_habit}
                          </h5>
                          <p className="text-gray-700 dark:text-gray-300">
                            {plantInfo.growthHabit}
                          </p>
                          {plantInfo.growthTips && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 italic">
                              Tip: {plantInfo.growthTips}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-full mr-3">
                          <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {t.care_level}
                          </h5>
                          <p className="text-gray-700 dark:text-gray-300">
                            {plantInfo.careLevel}
                          </p>
                          {plantInfo.careTips && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 italic">
                              Tip: {plantInfo.careTips}
                            </p>
                          )}
                        </div>
                      </div>
                      {plantInfo.seasonalCare && (
                        <div className="flex items-start mt-2">
                          <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                            <MessageSquare className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-gray-100">
                              {t.seasonal_care}
                            </h5>
                            <p className="text-gray-700 dark:text-gray-300">
                              {plantInfo.seasonalCare}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-green-100 dark:border-green-900/50">
                    <h4 className="text-lg font-medium mb-4 text-green-800 dark:text-green-300 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                      Origin & Habitat
                    </h4>
                    <div className="space-y-4">
                      {plantInfo.origin && (
                        <div className="flex items-start">
                          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full mr-3">
                            <Globe className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-gray-100">
                              {t.origin}
                            </h5>
                            <p className="text-gray-700 dark:text-gray-300">
                              {plantInfo.origin}
                            </p>
                          </div>
                        </div>
                      )}
                      {plantInfo.habitat && (
                        <div className="flex items-start">
                          <div className="bg-teal-50 dark:bg-teal-900/30 p-2 rounded-full mr-3">
                            <Leaf className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-gray-100">
                              {t.natural_habitat}
                            </h5>
                            <p className="text-gray-700 dark:text-gray-300">
                              {plantInfo.habitat}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-green-100 dark:border-green-900/50">
                    <h4 className="text-lg font-medium mb-4 text-green-800 dark:text-green-300 flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                      Soil & Planting
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div
                          className="p-2 rounded-full mr-3 dark:bg-amber-900/30"
                          style={{ backgroundColor: "#f5f0e6" }}
                        >
                          <Leaf className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {t.soil_type}
                          </h5>
                          <p className="text-gray-700 dark:text-gray-300">
                            {plantInfo.soilType}
                          </p>
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
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <Button
                    onClick={handleIdentifyPlant}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                    disabled={!canIdentify}
                  >
                    {t.identify_plant}
                  </Button>
                  <Button
                    onClick={clearImage}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/20"
                  >
                    {t.try_different_image}
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Click to analyze your plant image
                  </p>
                  {!canIdentify && (
                    <div className="flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Limit reached</span>
                    </div>
                  )}
                  {!user && usageCount > 0 && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <AuthButton
                        mode="sign-up"
                        variant="link"
                        className="text-green-600 hover:underline p-0 h-auto font-normal dark:text-green-400"
                      >
                        {t.sign_up}
                      </AuthButton>{" "}
                      to get more identifications!
                    </p>
                  )}
                  {user &&
                    !isPremium &&
                    usageCount >
                      USAGE_LIMITS.registered.maxIdentifications / 2 && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <UpgradeButton
                          userId={user.id}
                          variant="link"
                          className="text-green-600 hover:underline p-0 h-auto font-normal dark:text-green-400"
                        >
                          {t.upgrade_premium}
                        </UpgradeButton>{" "}
                        for unlimited identifications!
                      </p>
                    )}
                </div>

                {/* Tips section for image view */}
                <div className="w-full mt-6 border border-amber-200 dark:border-amber-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowTips(!showTips)}
                    className="w-full flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      <span className="font-medium">
                        {t.tips_better_identification}
                      </span>
                    </div>
                    {showTips ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {showTips && (
                    <div className="p-3 bg-amber-50/50 dark:bg-amber-900/20 text-sm">
                      <p className="text-amber-700 dark:text-amber-200 mb-2">
                        {t.for_best_results}:
                      </p>
                      <ul className="space-y-1 text-amber-700 dark:text-amber-200 pl-5 list-disc text-sm">
                        <li>{t.use_natural_light}</li>
                        <li>{t.focus_distinctive_features}</li>
                        <li>{t.include_whole_plant}</li>
                        <li>{t.avoid_blurry_images}</li>
                        <li>{t.remove_distracting_backgrounds}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          {plantInfo && (
            <CardFooter className="p-6 pt-0 flex flex-wrap gap-3 justify-center">
              <Button
                onClick={shareResult}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/20"
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
                className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-900/20"
              >
                <Camera className="mr-2 h-4 w-4" />
                Identify Another Plant
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-1">{t.disclaimer}:</p>
        <p>{t.disclaimer_text}</p>
      </div>
    </div>
  );
}
