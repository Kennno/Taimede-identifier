const GEMINI_API_KEY = "AIzaSyDF2bvq7-PRlcI6p-9upQq4LDQ6sFcx2Fk";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

export interface PlantInfo {
  name: string;
  scientificName: string;
  waterNeeds: string;
  lightNeeds: string;
  soilType: string;
  growthHabit: string;
  careLevel: string;
  healthStatus: {
    isHealthy: boolean;
    issues: string[];
    treatments: string[];
  };
  description?: string;
  origin?: string;
  habitat?: string;
}

export async function identifyPlantWithGemini(
  imageBase64: string,
): Promise<PlantInfo> {
  try {
    // Remove data URL prefix if present
    const base64Data = imageBase64.includes("base64,")
      ? imageBase64.split("base64,")[1]
      : imageBase64;

    console.log("Sending request to Gemini API...");

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "You are a plant identification expert. Analyze this plant image and provide detailed information in JSON format. Include the following fields: name (common name), scientificName (Latin name), description (detailed physical characteristics), origin (where the plant originates from), habitat (natural growing environment), waterNeeds (watering frequency and amount), lightNeeds (light requirements), soilType (soil preferences), growthHabit (how it grows), careLevel (difficulty level). Also carefully examine the plant for any health issues like diseases, pests, nutrient deficiencies, or other problems. Include a healthStatus object with: isHealthy (boolean), issues (array of strings describing any problems), and treatments (array of strings with specific treatment recommendations). If the plant appears healthy, set isHealthy to true and provide empty arrays for issues and treatments. Format your response as valid JSON only, with no additional text.",
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Handle the response format
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts
    ) {
      throw new Error("Unexpected response format from Gemini API");
    }

    // Extract text from response
    const responseText = data.candidates[0].content.parts[0].text;

    // Try to parse JSON directly first
    try {
      const plantInfo = JSON.parse(responseText.trim());

      // Ensure healthStatus exists with proper structure
      if (!plantInfo.healthStatus) {
        plantInfo.healthStatus = {
          isHealthy: true,
          issues: [],
          treatments: [],
        };
      }

      return plantInfo as PlantInfo;
    } catch (jsonError) {
      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch =
        responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) ||
        responseText.match(/{[\s\S]*}/);

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        try {
          const plantInfo = JSON.parse(jsonStr.trim());

          // Ensure healthStatus exists with proper structure
          if (!plantInfo.healthStatus) {
            plantInfo.healthStatus = {
              isHealthy: true,
              issues: [],
              treatments: [],
            };
          }

          return plantInfo as PlantInfo;
        } catch (nestedJsonError) {
          throw new Error("Failed to parse JSON from Gemini response");
        }
      } else {
        // If no JSON found, create a fallback response
        return {
          name: "Unknown Plant",
          scientificName: "Species unknown",
          description: "Unable to determine from the provided image",
          origin: "Unknown",
          habitat: "Unknown",
          waterNeeds: "Unable to determine",
          lightNeeds: "Unable to determine",
          soilType: "Unable to determine",
          growthHabit: "Unable to determine",
          careLevel: "Unable to determine",
          healthStatus: {
            isHealthy: false,
            issues: ["Unable to identify plant from image"],
            treatments: ["Try uploading a clearer image with better lighting"],
          },
        };
      }
    }
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw error;
  }
}
