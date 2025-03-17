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
  waterTips?: string;
  lightTips?: string;
  growthTips?: string;
  careTips?: string;
  seasonalCare?: string;
}

// Import the Gemini 2.0 function for premium users
import { identifyPlantWithGemini2 } from "./gemini-2.0";
import {
  getUserSubscriptionTier,
  SubscriptionTier,
  trackUsage,
  checkUsageLimit,
} from "./subscription-utils";

export async function identifyPlantWithGemini(
  imageBase64: string,
  language: string = "et",
  chatQuery: string = "",
  userId?: string,
  deviceId?: string,
): Promise<PlantInfo> {
  try {
    // Check if user has reached their usage limit
    if (!chatQuery && deviceId) {
      // Only check limits for plant identification, not chat
      const hasRemainingUsage = await checkUsageLimit(userId, deviceId);
      if (!hasRemainingUsage) {
        return {
          name: "Kasutuslimiit ületatud",
          scientificName: "Limiit ületatud",
          description:
            "Olete ületanud tasuta kasutuslimiidi. Palun registreeruge või uuendage oma tellimust, et jätkata.",
          waterNeeds: "Pole saadaval",
          lightNeeds: "Pole saadaval",
          soilType: "Pole saadaval",
          growthHabit: "Pole saadaval",
          careLevel: "Pole saadaval",
          healthStatus: {
            isHealthy: false,
            issues: ["Kasutuslimiit ületatud"],
            treatments: ["Uuendage oma tellimust, et jätkata"],
          },
        };
      }
    }

    // Check if user is premium to use Gemini 2.0
    if (userId) {
      const tier = await getUserSubscriptionTier(userId);
      if (tier === SubscriptionTier.PREMIUM) {
        // Use Gemini 2.0 for premium users
        const result = await identifyPlantWithGemini2(
          imageBase64,
          language,
          chatQuery,
        );

        // Track premium usage
        if (!chatQuery && deviceId) {
          await trackUsage(userId, deviceId, true);
        }

        return result;
      }
    }

    // For free users, continue with Gemini 1.5
    // Track usage for free users
    if (!chatQuery && userId && deviceId) {
      await trackUsage(userId, deviceId, false);
    } else if (!chatQuery && !userId && deviceId) {
      await trackUsage(undefined, deviceId, false);
    }

    // Check if this is a chat query or plant identification
    if (chatQuery) {
      // Removed console.log

      const promptText = `Sa oled taimetundmise ekspert ja taimede hoolduse assistent. Vasta järgmisele küsimusele taimede kohta: ${chatQuery}\n\nOled sõbralik ja abivalmis vestluskaaslane. Sinu vastused on lühikesed ja konkreetsed, mitte pikad monoloogid. Küsi kasutajalt täpsustavaid küsimusi, et paremini mõista tema taime olukorda. Ära anna kogu infot korraga, vaid jaga seda väiksemate osadena, et vestlus oleks loomulikum. \n\nKui kasutaja küsib konkreetse taime kohta, paku talle esmalt põhiinfot ja küsi, kas ta soovib teada midagi spetsiifilist (nt kastmine, valgus, väetamine). Kasuta vestluses ka küsimusi nagu "Kas sul on veel küsimusi selle taime kohta?" või "Kas soovid teada midagi konkreetset selle taime hoolduse kohta?". \n\nKui vestlus hakkab lõppema, võid pakkuda uusi teemasid, näiteks "Kas sul on veel mõni taim, mille kohta soovid nõu?" või "Kas oled mõelnud uute taimede lisamise peale oma kogusse?". \n\nVÄGA OLULINE: \n1. VASTA ALATI EESTI KEELES, ISEGI KUI KÜSIMUS ON INGLISE KEELES.\n2. JÄTKA VESTLUST LOOMULIKULT, VÕTTES ARVESSE EELNEVAID KÜSIMUSI JA VASTUSEID.\n3. KASUTA PROFESSIONAALSET, KUID KERGESTI MÕISTETAVAT EESTI KEELT.\n4. VÄLDI TÜPOGRAAFILISI VIGU JA EBALOOMULIKKE VÄLJENDEID.\n5. PAKU TÄPSEID JA KASULIKKE NÕUANDEID TAIMEDE HOOLDUSE KOHTA.\n6. KASUTA EELNEVAT VESTLUSE KONTEKSTI, ET PAKKUDA JÄRJEPIDEVAID JA ASJAKOHASEID VASTUSEID.`;

      // Create a history array for chat context if provided in the query
      const hasContextPrefix = chatQuery.includes(
        "Eelnevad sõnumid vestluses:",
      );
      let contents = [];

      if (hasContextPrefix) {
        // If there's context, we'll use it to create a more coherent conversation
        const parts = chatQuery.split(
          "\n\nVasta kasutaja viimasele küsimusele",
        );
        const contextPart = parts[0];
        const questionPart =
          parts.length > 1 ? parts[1].replace(/[,:] /g, "") : "";

        // Extract previous messages from context
        const contextLines = contextPart
          .replace("Eelnevad sõnumid vestluses:\n", "")
          .split("\n");
        const messages = [];

        for (const line of contextLines) {
          if (line.startsWith("Kasutaja: ")) {
            messages.push({
              role: "user",
              parts: [{ text: line.replace("Kasutaja: ", "") }],
            });
          } else if (line.startsWith("Assistent: ")) {
            messages.push({
              role: "model",
              parts: [{ text: line.replace("Assistent: ", "") }],
            });
          }
        }

        // Add the current question
        if (questionPart) {
          messages.push({
            role: "user",
            parts: [{ text: questionPart }],
          });
        }

        // If we have valid messages, use them for context
        if (messages.length > 0) {
          contents = messages;
          // Add system prompt as the first message
          contents.unshift({
            role: "user",
            parts: [{ text: promptText }],
          });
        }
      }

      // If no context was extracted, use the standard approach
      if (contents.length === 0) {
        contents = [
          {
            parts: [
              {
                text: promptText,
              },
            ],
          },
        ];
      }

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
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

    // Removed console.log

    const promptText =
      "Sa oled taimetundmise ekspert. Analüüsi seda taime pilti ja anna üksikasjalikku teavet JSON-vormingus. Lisa järgmised väljad: name (taime tavanimi), scientificName (ladina keelne nimi), description (üksikasjalikud füüsilised omadused), origin (kust taim pärineb), habitat (looduslik kasvukeskkond), waterNeeds (kastmissagedus ja kogus), lightNeeds (valgusnõuded), soilType (mullaeelistused), growthHabit (kuidas see kasvab), careLevel (hoolduse raskusaste). Lisa ka waterTips, lightTips, growthTips ja careTips väljad, mis sisaldavad konkreetseid nõuandeid. \n\nUuri hoolikalt ka taime terviseprobleeme, nagu haigused, kahjurid, toitainete puudused või muud probleemid. Lisa healthStatus objekt järgmisega: isHealthy (boolean), issues (massiiv stringidest, mis kirjeldavad probleeme) ja treatments (massiiv stringidest konkreetsete ravisoovitustega). Kui taim tundub terve, määra isHealthy väärtuseks true ja esita tühjad massiivid probleemide ja ravimeetodite jaoks. Lisa ka seasonalCare väli hooajaliste hooldusnõuannete jaoks. \n\nVorminda oma vastus ainult kehtiva JSON-ina, ilma täiendava tekstita. Ära kasuta JSON-i sees objekte väljadel, mis ei ole healthStatus - kõik väljad peale healthStatus peavad olema stringid. \n\nVÄGA OLULINE: \n1. KÕIK VASTUSED PEAVAD OLEMA KORREKTSES JA PROFESSIONAALSES EESTI KEELES, ISEGI KUI KÜSIMUS ON INGLISE KEELES.\n2. KASUTA SELGET JA TÄPSET KEELT, VÄLDI TÜPOGRAAFILISI VIGU JA EBALOOMULIKKE VÄLJENDEID.\n3. TAIME KIRJELDUSED, HOOLDUSJUHISED JA TERVISESEISUNDI DIAGNOSTIKA PEAVAD OLEMA HÄSTI STRUKTUREERITUD JA SELGED.\n4. KASUTA PROFESSIONAALSET, KUID KERGESTI MÕISTETAVAT EESTI KEELT.\n5. TERVISESEISUNDI KIRJELDUSED PEAVAD OLEMA TÄPSED JA SISALDAMA KONKREETSEID SOOVITUSI.\n6. KÕIK VÄLJAD PEALE healthStatus PEAVAD OLEMA STRINGID, MITTE OBJEKTID.";

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

      // Ensure all object properties are strings to prevent React rendering issues
      Object.keys(plantInfo).forEach((key) => {
        if (
          typeof plantInfo[key] === "object" &&
          plantInfo[key] !== null &&
          key !== "healthStatus"
        ) {
          plantInfo[key] = JSON.stringify(plantInfo[key]);
        }
      });

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

          // Ensure all object properties are strings to prevent React rendering issues
          Object.keys(plantInfo).forEach((key) => {
            if (
              typeof plantInfo[key] === "object" &&
              plantInfo[key] !== null &&
              key !== "healthStatus"
            ) {
              plantInfo[key] = JSON.stringify(plantInfo[key]);
            }
          });

          return plantInfo as PlantInfo;
        } catch (nestedJsonError) {
          throw new Error("Failed to parse JSON from response");
        }
      } else {
        // If no JSON found, create a fallback response
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
            treatments: ["Proovi laadida üles selgem pilt parema valgustusega"],
          },
        };
      }
    }
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw error;
  }
}
