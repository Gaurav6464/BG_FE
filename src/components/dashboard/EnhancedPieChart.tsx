import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Enhanced Pie Chart Component with proper spacing
const EnhancedPieChart: React.FC<{
  data: any[];
  labelKey: string;
  colors: string[];
  showPercentage?: boolean;
}> = ({ data, labelKey, colors, showPercentage = true }) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <defs>
          {colors.map((color, index) => (
            <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.7}/>
            </linearGradient>
          ))}
        </defs>
        <Pie
          data={data}
          dataKey="count"
          nameKey={labelKey}
          cx="50%"
          cy="45%"
          outerRadius={85}
          innerRadius={35}
          paddingAngle={3}
          label={showPercentage ? ({ percentage }) => `${percentage}%` : false}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={`url(#gradient${index % colors.length})`} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
            backdropFilter: 'blur(10px)'
          }}
          formatter={(value: any, name: string) => [`${value} items`, name]}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '15px', fontSize: '14px' }}
          iconType="circle"
          layout="horizontal"
          align="center"
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default EnhancedPieChart ;