const API_KEY = "AIzaSyBY5ZZHOzW-Y_YU5ysPrusiVJjXaFjoV90";
const API_URL =
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
  response?: string;
}

export async function identifyPlantWithGemini(
  imageBase64: string,
  language: string = "en",
  chatQuery: string = "",
): Promise<PlantInfo> {
  try {
    // Check if this is a chat query or plant identification
    if (chatQuery) {
      console.log("Sending chat query to Gemini API...");

      const promptText =
        language === "et"
          ? `Sa oled taimetundmise ekspert ja taimede hoolduse assistent. Vasta järgmisele küsimusele taimede kohta: ${chatQuery}`
          : `You are a plant care expert and assistant. Please answer the following question about plants: ${chatQuery}`;

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts
      ) {
        throw new Error("Unexpected response format from API");
      }

      const responseText = data.candidates[0].content.parts[0].text;

      return {
        name: "Chat Response",
        scientificName: "",
        waterNeeds: "",
        lightNeeds: "",
        soilType: "",
        growthHabit: "",
        careLevel: "",
        healthStatus: {
          isHealthy: true,
          issues: [],
          treatments: [],
        },
        response: responseText
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\d+\. /g, "")
          .replace(/\n\n/g, "\n"),
      };
    }

    // For plant identification
    // Remove data URL prefix if present
    const base64Data = imageBase64.includes("base64,")
      ? imageBase64.split("base64,")[1]
      : imageBase64;

    console.log("Sending request to identification API...");

    const promptText =
      language === "et"
        ? "Sa oled taimetundmise ekspert. Analüüsi seda taime pilti ja anna üksikasjalikku teavet JSON-vormingus. Lisa järgmised väljad: name (tavalise nime), scientificName (ladina keelne nimi), description (üksikasjalikud füüsilised omadused), origin (kust taim pärineb), habitat (looduslik kasvukeskkond), waterNeeds (kastmissagedus ja kogus), lightNeeds (valgusnõuded), soilType (mullaeelistused), growthHabit (kuidas see kasvab), careLevel (raskusaste). Uuri hoolikalt ka taime terviseprobleeme, nagu haigused, kahjurid, toitainete puudused või muud probleemid. Lisa healthStatus objekt järgmisega: isHealthy (boolean), issues (massiiv stringidest, mis kirjeldavad probleeme) ja treatments (massiiv stringidest konkreetsete ravisoovitustega). Kui taim tundub terve, määra isHealthy väärtuseks true ja esita tühjad massiivid probleemide ja ravimeetodite jaoks. Vorminda oma vastus ainult kehtiva JSON-ina, ilma täiendava tekstita."
        : "You are a plant identification expert. Analyze this plant image and provide detailed information in JSON format. Include the following fields: name (common name), scientificName (Latin name), description (detailed physical characteristics with color, texture, and distinctive features), origin (where the plant originates from with specific regions), habitat (natural growing environment including climate preferences), waterNeeds (precise watering frequency and amount with seasonal adjustments), lightNeeds (detailed light requirements including intensity and duration), soilType (specific soil preferences including pH and composition), growthHabit (detailed growth pattern, rate, and mature size), careLevel (difficulty level with specific maintenance requirements). Also carefully examine the plant for any health issues like diseases, pests, nutrient deficiencies, or other problems. For the healthStatus object, provide: isHealthy (boolean), issues (comprehensive array of strings describing any visible problems with specific symptoms), and treatments (detailed array of strings with specific treatment recommendations including preventative care). If the plant appears healthy, include recommendations to maintain its health. Format your response as valid JSON only, with no additional text.";

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText,
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
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Handle the response format
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts
    ) {
      throw new Error("Unexpected response format from API");
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
          throw new Error("Failed to parse JSON from response");
        }
      } else {
        // If no JSON found, create a fallback response
        if (language === "et") {
          return {
            name: "Tundmatu taim",
            scientificName: "Liik teadmata",
            description: "Ei suuda määrata esitatud pildi põhjal",
            origin: "Teadmata",
            habitat: "Teadmata",
            waterNeeds: "Ei suuda määrata",
            lightNeeds: "Ei suuda määrata",
            soilType: "Ei suuda määrata",
            growthHabit: "Ei suuda määrata",
            careLevel: "Ei suuda määrata",
            healthStatus: {
              isHealthy: false,
              issues: ["Ei suuda taime pildilt tuvastada"],
              treatments: [
                "Proovi laadida üles selgem pilt parema valgustusega",
              ],
            },
          };
        } else {
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
              treatments: [
                "Try uploading a clearer image with better lighting",
              ],
            },
          };
        }
      }
    }
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw error;
  }
}
