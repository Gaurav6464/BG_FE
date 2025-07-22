import { Clock } from "lucide-react";

// Header component
const HeaderCard: React.FC = () => (
  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
    <div className="relative">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-3">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 text-base md:text-lg font-medium">Real-time insights into your events and users</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span className="hidden sm:inline">Last updated: {new Date().toLocaleTimeString()}</span>
          <span className="sm:hidden">Updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  </div>
);


export default HeaderCard ;