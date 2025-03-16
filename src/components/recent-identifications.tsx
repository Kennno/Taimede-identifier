"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  getIdentificationsFromStorage,
  StoredIdentification,
} from "@/lib/local-storage";
import { supabase } from "../../supabase/supabase";
import { Leaf, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentIdentificationsProps {
  user: User | null;
}

export default function RecentIdentifications({
  user,
}: RecentIdentificationsProps) {
  const [localIdentifications, setLocalIdentifications] = useState<
    StoredIdentification[]
  >([]);
  const [dbIdentifications, setDbIdentifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIdentifications = async () => {
      setIsLoading(true);

      if (user) {
        // Fetch from database for logged in users
        try {
          const { data, error } = await supabase
            .from("recent_searches")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);

          if (error) throw error;
          setDbIdentifications(data || []);
        } catch (error) {
          console.error("Error fetching recent searches:", error);
        }
      } else {
        // Get from localStorage for unregistered users
        const storedIdentifications = getIdentificationsFromStorage();
        setLocalIdentifications(storedIdentifications);
      }

      setIsLoading(false);
    };

    fetchIdentifications();
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  // Combine and display identifications based on user status
  const identifications = user ? dbIdentifications : localIdentifications;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Identifications</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">Loading...</div>
        ) : identifications.length > 0 ? (
          <div className="space-y-4">
            {identifications.map((item) => {
              // Handle different property names between DB and localStorage
              const plantName = user ? item.plant_name : item.plantName;
              const scientificName = user
                ? item.scientific_name
                : item.scientificName;
              const date = user ? item.created_at : item.identifiedAt;
              const imageUrl = user ? item.image_url : item.imageUrl;

              return (
                <div
                  key={user ? item.id : item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={plantName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-green-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{plantName}</h4>
                    <p className="text-sm text-gray-500 italic">
                      {scientificName}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(date)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No plant identifications yet. Upload a plant photo to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
