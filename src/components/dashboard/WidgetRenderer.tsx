import type { StatCard } from "../../types/Dashboard";
import EventWidget from "./EventWidget";
import SummaryWidget from "./SummaryWidget";
import UserWidget from "./UserWidget";


const WidgetRenderer: React.FC<{
  widgetKey: string;
  stats: StatCard[];
  chartData: any;
}> = ({ widgetKey, stats, chartData }) => {
  switch (widgetKey) {
    case "summary":
      return <SummaryWidget stats={stats} />;
    case "event":
      return <EventWidget chartData={chartData} />;
    case "user":
      return <UserWidget chartData={chartData} />;
    default:
      return null;
  }
};

export default WidgetRenderer