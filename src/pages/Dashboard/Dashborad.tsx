import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend, // Added Legend for Pie Charts
} from "recharts";
import { Calendar, Users, Activity, UserCheck } from "lucide-react";
import UserService from "../../api/user";
import eventService from "../../api/events";
import type { User } from "../../types/user.type";
import type { Event } from "../../types/event.type";
import type {
  EventStatusData,
  EventTypeData,
  OnlineOfflineData,
  StatCard,
  UserRoleData,
  VerificationData,
} from "../../types/Dashboard";
import { useQuery } from "@tanstack/react-query";

const Dashboard: React.FC = () => {
  const {
    data: events = [],
    isLoading: eventsLoading,
    error: eventsError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await eventService.getAllEvents();
      return res.data as Event[];
    },
  });

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await UserService.getAllUser();
      return res.data as User[];
    },
  });

  const loading = eventsLoading || usersLoading;
  const error = eventsError || usersError;

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const eventsByType = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  const eventTypeData: EventTypeData[] = Object.entries(eventsByType).map(
    ([type, count]) => ({ type: cap(type), count })
  );

  const eventsByStatus = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  const eventStatusData: EventStatusData[] = Object.entries(
    eventsByStatus
  ).map(([status, count]) => ({ status: cap(status), count }));

  const onlineVsOffline = events.reduce<Record<string, number>>((acc, e) => {
    const key = e.isOnline ? "Online" : "Offline";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const onlineOfflineData: OnlineOfflineData[] = Object.entries(
    onlineVsOffline
  ).map(([mode, count]) => ({ mode, count }));

  const usersByRole = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const userRoleData: UserRoleData[] = Object.entries(usersByRole).map(
    ([role, count]) => ({ role: cap(role), count })
  );

  const verificationData = users.reduce<Record<string, number>>((acc, u) => {
    const key = u.isVerified ? "Verified" : "Unverified";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const verificationChartData: VerificationData[] = Object.entries(
    verificationData
  ).map(([status, count]) => ({ status, count }));

  // Define color palettes for charts (updated for better design)
  const COLORS = [
    "#6366f1", // Indigo-500
    "#22c55e", // Green-500
    "#f97316", // Orange-500
    "#8b5cf6", // Violet-500
    "#06b6d4", // Cyan-500
    "#ec4899", // Pink-500
  ];
  const STATUS_COLORS = ["#22c55e", "#f59e0b", "#ef4444"]; // Green, Amber, Red

  const stats: StatCard[] = [
    {
      title: "Total Events",
      value: events.length,
      icon: Calendar,
      color: "bg-indigo-500", // Updated color
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Verified Users",
      value: users.filter((u) => u.isVerified).length,
      icon: UserCheck,
      color: "bg-purple-500",
    },
    {
      title: "Online Events",
      value: events.filter((e) => e.isOnline).length,
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2 text-gray-700">
          <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading data...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        <p className="text-lg font-medium">Failed to load data. Please try again later.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 font-inter antialiased">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-200 transform transition-all duration-300 hover:scale-[1.01]">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
            Analytics <span className="text-indigo-600">Dashboard</span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl font-light">Comprehensive overview of event and user management</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 flex items-center justify-between
                         hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]
                         relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-gray-600 mb-1">{s.title}</p>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div className={`${s.color} p-4 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className="h-7 w-7 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events by Type Chart */}
          <ChartCard title="Events by Type">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventTypeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" vertical={false} />
                <XAxis dataKey="type" axisLine={false} tickLine={false} className="text-sm text-gray-600" />
                <YAxis axisLine={false} tickLine={false} className="text-sm text-gray-600" />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.07)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={30}>
                  {
                    eventTypeData.map((entry, index) => (
                      <>
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}  />
                      {entry.count}
                      </>
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Event Status Distribution Chart */}
          <ChartCard title="Event Status Distribution">
            <PieChartComponent
              data={eventStatusData}
              labelKey="status"
              colors={STATUS_COLORS}
            />
          </ChartCard>

          {/* Online vs Offline Events Chart */}
          <ChartCard title="Online vs Offline Events">
            <PieChartComponent
              data={onlineOfflineData}
              labelKey="mode"
              colors={COLORS}
            />
          </ChartCard>

          {/* Users by Role Chart */}
          <ChartCard title="Users by Role">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userRoleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" vertical={false} />
                <XAxis dataKey="role" axisLine={false} tickLine={false} className="text-sm text-gray-600" />
                <YAxis axisLine={false} tickLine={false} className="text-sm text-gray-600" />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.07)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} barSize={30}>
                  {
                    userRoleData.map((entry, index) => (<>
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}   />
                    {entry.count}
                    
                    </>
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* User Verification Status Chart */}
        <div className="grid grid-cols-1 gap-6">
          <ChartCard title="User Verification Status">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <PieChartComponent
                data={verificationChartData}
                labelKey="status"
                colors={["#22c55e", "#ef4444"]} // Green for Verified, Red for Unverified
                height={200}
                outerRadius={80}
                showLabel={false}
              />
              <div className="flex flex-col justify-center space-y-4">
                <LegendRow
                  label="Verified"
                  color="bg-green-500"
                  value={verificationData.Verified || 0}
                />
                <LegendRow
                  label="Unverified"
                  color="bg-red-500"
                  value={verificationData.Unverified || 0}
                />
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

// Reusable Chart Card component
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200
                  hover:shadow-2xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-3 border-gray-100">
      {title}
    </h3>
    {children}
  </div>
);

// Reusable Pie Chart component
const PieChartComponent: React.FC<{
  data: any[];
  labelKey: string;
  colors: string[];
  height?: number;
  outerRadius?: number;
  showLabel?: boolean;
}> = ({ data, labelKey, colors, height = 300, outerRadius = 80, showLabel = true }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={showLabel ? (d: any) => `${d[labelKey]} (${(d.percent * 100).toFixed(0)}%)` : undefined}
        outerRadius={outerRadius}
        fill="#8884d8" // This fill is overridden by Cell components
        dataKey="count"
      >
        {data.map((entry, index) => (
          
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]}  className={entry}/>
        
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number, props: any) => [`${value} ${props.payload?.[labelKey] || ''}`, 'Count']}
        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    
      />
      <Legend
        layout="horizontal"
        verticalAlign="bottom"
        align="center"
        wrapperStyle={{ paddingTop: '20px', fontSize: '14px', color: '#4b5563' }}
        formatter={(value, entry) => {
          const payload = entry.payload as any; // Explicitly cast to any
          return (
            <span className="font-medium text-gray-700">
              {value}
              {payload?.[labelKey] || 'N/A'}: <span className="font-semibold text-gray-900">{payload?.count || 0}</span>
            </span>
          );
        }}
      />
    </PieChart>
  </ResponsiveContainer>
);

// Reusable Legend Row component for custom legends
const LegendRow: React.FC<{ label: string; color: string; value: number }> = ({
  label,
  color,
  value,
}) => (
  <div className="flex items-center space-x-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100
                  hover:bg-gray-50 transition-colors duration-200">
    <div className={`w-6 h-6 ${color} rounded-full shadow-md`} />
    <span className="text-base font-medium text-gray-700 flex-grow">
      {label}: <span className="font-semibold text-gray-900">{value}</span>
    </span>
  </div>
);

export default Dashboard;
