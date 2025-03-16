// Theme utility functions for consistent dark mode implementation

/**
 * Generates consistent dark mode class names for various UI elements
 * @param baseClass - The base class name
 * @param darkClass - The dark mode class name
 * @returns A string with both class names
 */
export const darkModeClass = (baseClass: string, darkClass: string): string => {
  return `${baseClass} dark:${darkClass}`;
};

/**
 * Applies consistent background colors for cards and sections
 * @param lightBg - Optional custom light background
 * @param darkBg - Optional custom dark background
 * @returns A string with background classes
 */
export const cardBackground = (
  lightBg = "bg-white",
  darkBg = "bg-gray-800",
): string => {
  return `${lightBg} dark:${darkBg} transition-colors duration-200`;
};

/**
 * Applies consistent text colors
 * @param lightText - Optional custom light text color
 * @param darkText - Optional custom dark text color
 * @returns A string with text color classes
 */
export const textColor = (
  lightText = "text-gray-900",
  darkText = "text-gray-100",
): string => {
  return `${lightText} dark:${darkText}`;
};

/**
 * Applies consistent border colors
 * @param lightBorder - Optional custom light border color
 * @param darkBorder - Optional custom dark border color
 * @returns A string with border color classes
 */
export const borderColor = (
  lightBorder = "border-gray-200",
  darkBorder = "border-gray-700",
): string => {
  return `${lightBorder} dark:${darkBorder}`;
};

/**
 * Creates a consistent hover effect
 * @param lightHover - Optional custom light hover effect
 * @param darkHover - Optional custom dark hover effect
 * @returns A string with hover effect classes
 */
export const hoverEffect = (
  lightHover = "hover:bg-gray-100",
  darkHover = "dark:hover:bg-gray-700",
): string => {
  return `${lightHover} ${darkHover}`;
};

/**
 * Creates a consistent gradient background
 * @param lightGradient - Optional custom light gradient
 * @param darkGradient - Optional custom dark gradient
 * @returns A string with gradient classes
 */
export const gradientBackground = (
  lightGradient = "bg-gradient-to-r from-green-50 to-emerald-50",
  darkGradient = "dark:bg-gradient-to-r dark:from-green-900/30 dark:to-emerald-900/30",
): string => {
  return `${lightGradient} ${darkGradient}`;
};
