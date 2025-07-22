import { Shield, Users } from "lucide-react";
import ChartCard from "./ChartCard";
import EnhancedAreaChart from "./EnhancedAreaChart";
import EnhancedPieChart from "./EnhancedPieChart";

const UserWidget: React.FC<{ chartData: any }> = ({ chartData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
    <ChartCard title="Users by Role" icon={Users}>
      <EnhancedAreaChart
        data={chartData.userRoleData}
        dataKey="count"
        xAxisKey="role"
        color="#10b981"
      />
    </ChartCard>

    <ChartCard title="Verification Status" icon={Shield}>
      <EnhancedPieChart
        data={chartData.verificationChartData}
        labelKey="status"
        colors={["#10b981", "#ef4444"]}
      />
    </ChartCard>
  </div>
);

export default UserWidget
