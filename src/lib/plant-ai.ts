import { identifyPlantWithGemini } from "./gemini";

export interface PlantInfo {
  name: string;
  scientificName: string;
  description?: string;
  origin?: string;
  habitat?: string;
  waterNeeds: string;
  waterTips?: string;
  lightNeeds: string;
  lightTips?: string;
  soilType: string;
  growthHabit: string;
  growthTips?: string;
  careLevel: string;
  careTips?: string;
  seasonalCare?: string;
  healthStatus?: {
    isHealthy: boolean;
    issues: string[];
    treatments: string[];
  };
}

// Function to identify plants from images
export async function identifyPlant(
  imageBase64: string,
  language: "en" | "et" = "et", // Changed default to Estonian
): Promise<PlantInfo> {
  try {
    // Call the Gemini API to identify the plant
    const plantInfo = await identifyPlantWithGemini(imageBase64, language);
    return plantInfo;
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw new Error("Failed to identify plant");
  }
}
