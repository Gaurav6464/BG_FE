import { Activity } from "lucide-react";

// No widgets message
const NoWidgetsMessage: React.FC = () => (
  <div className="text-center py-20">
    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <Activity className="w-10 h-10 text-slate-400" />
    </div>
    <h3 className="text-xl font-semibold text-slate-700 mb-2">No Widgets Selected</h3>
    <p className="text-slate-500">Configure your dashboard to display relevant widgets.</p>
  </div>
);

export default NoWidgetsMessage ;