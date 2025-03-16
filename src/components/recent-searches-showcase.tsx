"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabase/supabase";
import { Leaf, Camera, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import AuthButton from "./auth-button";

interface RecentSearchesShowcaseProps {
  user: User | null;
  limit?: number;
}

export default function RecentSearchesShowcase({
  user,
  limit = 3,
}: RecentSearchesShowcaseProps) {
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("recent_searches")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        setRecentSearches(data || []);
      } catch (error) {
        console.error("Error fetching recent searches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSearches();
  }, [user, limit]);

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm border border-green-100">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Leaf className="h-5 w-5 text-green-600 mr-2" />
          Your Plant Journey
        </h3>
        <p className="text-gray-600 mb-4">
          Sign up to save your identified plants and build your personal
          collection.
        </p>
        <AuthButton
          mode="sign-up"
          className="bg-green-600 hover:bg-green-700 w-full"
        >
          Create Free Account
        </AuthButton>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Leaf className="h-5 w-5 text-green-600 mr-2" />
          Recent Identifications
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentSearches.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Leaf className="h-5 w-5 text-green-600 mr-2" />
          Recent Identifications
        </h3>
        <div className="text-center py-6">
          <div className="bg-gray-100 p-3 rounded-full inline-flex mb-3">
            <Camera className="h-6 w-6 text-gray-500" />
          </div>
          <p className="text-gray-500 mb-4">No plants identified yet</p>
          <Button className="bg-green-600 hover:bg-green-700">
            Identify Your First Plant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-green-100">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Leaf className="h-5 w-5 text-green-600 mr-2" />
          Recent Identifications
        </h3>
        <div className="space-y-4">
          {recentSearches.map((search) => (
            <div key={search.id} className="flex items-center gap-3 group">
              <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                {search.image_url && (
                  <img
                    src={search.image_url}
                    alt={search.plant_name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-gray-900">
                  {search.plant_name}
                </h4>
                <p className="text-sm text-gray-500">
                  {search.scientific_name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <Button variant="link" className="text-green-600 p-0 h-auto" asChild>
            <a href="/dashboard">View All Identifications</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
