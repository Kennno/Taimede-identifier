"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try refreshing the page.
        </p>
        <Button
          onClick={() => reset()}
          className="bg-green-600 hover:bg-green-700"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
