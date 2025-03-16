"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Leaf,
  Sprout,
  Bell,
  LineChart,
  Cloud,
  BookOpen,
  Users,
  Trophy,
  Smartphone,
  CheckCircle,
  Clock,
  CalendarClock,
  Rocket,
  LucideIcon,
} from "lucide-react";

export type MilestoneStatus =
  | "completed"
  | "in-progress"
  | "planned"
  | "future";

export interface Milestone {
  title: string;
  description: string;
  status: MilestoneStatus;
  icon: string;
}

interface RoadmapTimelineProps {
  milestones: Milestone[];
}

const iconMap: Record<string, any> = {
  Leaf: Leaf,
  Sprout: Sprout,
  Bell: Bell,
  LineChart: LineChart,
  Cloud: Cloud,
  BookOpen: BookOpen,
  Users: Users,
  Trophy: Trophy,
  Smartphone: Smartphone,
};

const statusConfig: Record<
  MilestoneStatus,
  { color: string; icon: any; label: string }
> = {
  completed: {
    color: "bg-green-500 dark:bg-green-600",
    icon: CheckCircle,
    label: "Completed",
  },
  "in-progress": {
    color: "bg-blue-500 dark:bg-blue-600",
    icon: Clock,
    label: "In Progress",
  },
  planned: {
    color: "bg-amber-500 dark:bg-amber-600",
    icon: CalendarClock,
    label: "Coming Soon",
  },
  future: {
    color: "bg-purple-500 dark:bg-purple-600",
    icon: Rocket,
    label: "Future Plan",
  },
};

export function RoadmapTimeline({ milestones }: RoadmapTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<MilestoneStatus | "all">(
    "all",
  );

  const filteredMilestones = milestones.filter(
    (milestone) => activeFilter === "all" || milestone.status === activeFilter,
  );

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setActiveFilter("all")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeFilter === "all"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
          )}
        >
          All Features
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status as MilestoneStatus)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
              activeFilter === status
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
            )}
          >
            <config.icon className="h-4 w-4" />
            {config.label}
          </button>
        ))}
      </div>

      <div className="space-y-8 relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />

        {filteredMilestones.map((milestone, index) => {
          const IconComponent = iconMap[milestone.icon] || Leaf;
          const statusDetails = statusConfig[milestone.status];
          const StatusIcon = statusDetails.icon;

          return (
            <motion.div
              key={milestone.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-shrink-0 flex md:flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center z-10",
                    statusDetails.color,
                  )}
                >
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="h-full w-full md:w-0.5 bg-gray-200 dark:bg-gray-700 md:hidden" />
              </div>

              <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {milestone.title}
                  </h3>
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium",
                      statusDetails.color,
                    )}
                  >
                    <StatusIcon className="h-4 w-4" />
                    <span>{statusDetails.label}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
