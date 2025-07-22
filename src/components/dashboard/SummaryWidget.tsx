import StatCard from "./StatCard";




const SummaryWidget: React.FC<{ stats: any }> = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    {stats.map((stat:any, i:any) => (
      <StatCard key={i} stat={stat} />
    ))}
  </div>
);

export default SummaryWidget