import { Activity } from "lucide-react";

// Loading skeleton component
export const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="animate-pulse">
        <div className="h-32 bg-white/70 rounded-3xl shadow-sm border border-white/50"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-white/70 rounded-2xl shadow-sm border border-white/50"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-96 bg-white/70 rounded-2xl shadow-sm border border-white/50"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error component
export const ErrorState: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
    <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Activity className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Data</h2>
      <p className="text-gray-600">Please check your connection and try again.</p>
    </div>
  </div>
);
