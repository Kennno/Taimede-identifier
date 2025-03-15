import { Leaf } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-sm opacity-50"></div>
        <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full">
          <Leaf className="h-5 w-5 text-white" />
        </div>
      </div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
        PlantID
      </span>
    </div>
  );
}
