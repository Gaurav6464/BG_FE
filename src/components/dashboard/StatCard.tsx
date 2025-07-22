import { TrendingUp } from "lucide-react";


const StatCard: React.FC<{ stat: any }> = ({ stat }) => (
  <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
        {stat.change && (
          <div className="flex items-center space-x-1 text-emerald-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>{stat.change}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.value.toLocaleString()}</p>
        <p className="text-slate-600 font-medium text-sm md:text-base">{stat.title}</p>
      </div>
    </div>
  </div>
);

export default StatCard ;