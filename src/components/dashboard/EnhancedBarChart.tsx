import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EnhancedBarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  colors: string[];
  title?: string;
}

const EnhancedBarChart: React.FC<EnhancedBarChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  colors,
  title,
}) => {
  console.log("Bar chart rendering with data:", data);

  return (
    <div className="w-full h-80">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <defs>
            {colors.map((color, index) => (
              <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.9} />
                <stop offset="95%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={{ stroke: "#e2e8f0" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
              backdropFilter: "blur(10px)",
            }}
          />
          <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={`url(#barGradient${index % colors.length})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnhancedBarChart;
