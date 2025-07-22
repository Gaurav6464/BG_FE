import { Calendar, MapPin, TrendingUp } from "lucide-react";
import ChartCard from "./ChartCard";
import EnhancedPieChart from "./EnhancedPieChart";
import EnhancedBarChart from "./EnhancedBarChart";

const EventWidget: React.FC<{ chartData: any }> = ({ chartData }) => {
  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899"];
  const STATUS_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <ChartCard title="Events by Type" icon={Calendar}>
        <EnhancedBarChart
          data={chartData.eventTypeData}
          dataKey="count"
          xAxisKey="type"
          colors={COLORS}
        />
      </ChartCard>

      <ChartCard title="Event Status" icon={TrendingUp}>
        <EnhancedPieChart
          data={chartData.eventStatusData}
          labelKey="status"
          colors={STATUS_COLORS}
        />
      </ChartCard>

      <ChartCard title="Event Format" icon={MapPin}>
        <EnhancedPieChart
          data={chartData.onlineOfflineData}
          labelKey="mode"
          colors={COLORS}
        />
      </ChartCard>
    </div>
  );
};

export default EventWidget