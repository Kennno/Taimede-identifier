import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Calendar, Leaf } from "lucide-react";
import HealthStatus from "@/components/health-status";

export default async function PlantDetails({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: plant, error } = await supabase
    .from("plants")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !plant) {
    return redirect("/dashboard");
  }

  const plantData = plant.plant_data;

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </a>
            </Button>
            <h1 className="text-3xl font-bold">Plant Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="relative h-64 sm:h-80">
                  <img
                    src={plant.image_url}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{plant.name}</CardTitle>
                  <p className="text-gray-500 italic">
                    {plant.scientific_name}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Identified on{" "}
                      {new Date(plant.identified_at).toLocaleDateString()}
                    </span>
                  </div>

                  {plantData.healthStatus && (
                    <HealthStatus healthStatus={plantData.healthStatus} />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span>Plant Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Characteristic</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          Water Needs
                        </TableCell>
                        <TableCell>{plantData.waterNeeds}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Light Needs
                        </TableCell>
                        <TableCell>{plantData.lightNeeds}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Soil Type</TableCell>
                        <TableCell>{plantData.soilType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Growth Habit
                        </TableCell>
                        <TableCell>{plantData.growthHabit}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Care Level
                        </TableCell>
                        <TableCell>{plantData.careLevel}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="mt-8 flex justify-center">
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <a href="/">Identify Another Plant</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
