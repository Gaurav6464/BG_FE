import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const EnhancedAreaChart: React.FC<{
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color: string;
}> = ({ data, dataKey, xAxisKey, color }) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={{ stroke: '#e2e8f0' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          fillOpacity={1} 
          fill="url(#areaGradient)"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default EnhancedAreaChart ;