import { AlertCircle, CheckCircle, Leaf, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface HealthStatusProps {
  healthStatus: {
    isHealthy: boolean;
    issues: string[];
    treatments: string[];
  };
}

export function HealthStatus({ healthStatus }: HealthStatusProps) {
  const { isHealthy, issues, treatments } = healthStatus;

  return (
    <Card
      className={`border-l-4 ${isHealthy ? "border-l-green-500" : "border-l-amber-500"}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isHealthy ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Kuvatud taime terviseseisund: Terve</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span>Kuvatud taime terviseseisund: Probleemid tuvastatud</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isHealthy && (
          <div className="space-y-4">
            {issues.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tuvastatud probleemid:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {treatments.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Soovitatud lahendused:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {treatments.map((treatment, index) => (
                    <li key={index}>{treatment}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {isHealthy && (
          <p className="text-sm text-gray-600">
            Terviseprobleeme ei tuvastatud. Jätka tavalise hooldusega optimaalse
            kasvu tagamiseks.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Also add default export to maintain compatibility with existing imports
export default HealthStatus;
