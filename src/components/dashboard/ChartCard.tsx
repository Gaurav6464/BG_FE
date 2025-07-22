const ChartCard: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  icon?: React.ComponentType<any>;
}> = ({ title, children, icon: Icon }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center space-x-3 mb-6">
      {Icon && (
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
    <div className="min-h-[320px]">
      {children}
    </div>
  </div>
);

export default ChartCard