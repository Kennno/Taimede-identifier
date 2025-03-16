// Helper functions for working with localStorage

export interface StoredIdentification {
  id: string;
  imageUrl: string;
  plantName: string;
  scientificName: string;
  identifiedAt: string;
  searchData: any;
}

// Save identification to localStorage
export function saveIdentificationToStorage(
  identification: StoredIdentification,
): void {
  if (typeof window === "undefined") return;

  try {
    // Get existing identifications
    const existingData = getIdentificationsFromStorage();

    // Add new identification
    existingData.push(identification);

    // Save back to localStorage
    localStorage.setItem("plantIdentifications", JSON.stringify(existingData));
  } catch (error) {
    console.error("Error saving identification to localStorage:", error);
  }
}

// Get all identifications from localStorage
export function getIdentificationsFromStorage(): StoredIdentification[] {
  if (typeof window === "undefined") return [];

  try {
    const storedData = localStorage.getItem("plantIdentifications");
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Error retrieving identifications from localStorage:", error);
    return [];
  }
}

// Get device ID or create a new one
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem("plantid_device_id");
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("plantid_device_id", deviceId);
  }
  return deviceId;
}

// Get unregistered user identification count from localStorage
export function getUnregisteredIdentificationCount(): number {
  if (typeof window === "undefined") return 0;

  try {
    // Get the current month and year to create a month-specific key
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const key = `unregisteredIdentificationCount_${monthKey}`;

    const count = localStorage.getItem(key);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error(
      "Error retrieving identification count from localStorage:",
      error,
    );
    return 0;
  }
}

// Increment unregistered user identification count
export function incrementUnregisteredIdentificationCount(): void {
  if (typeof window === "undefined") return;

  try {
    // Get the current month and year to create a month-specific key
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const key = `unregisteredIdentificationCount_${monthKey}`;

    const currentCount = getUnregisteredIdentificationCount();
    localStorage.setItem(key, (currentCount + 1).toString());
  } catch (error) {
    console.error(
      "Error incrementing identification count in localStorage:",
      error,
    );
  }
}

// Clear all stored identifications
export function clearStoredIdentifications(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("plantIdentifications");
  } catch (error) {
    console.error("Error clearing identifications from localStorage:", error);
  }
}
