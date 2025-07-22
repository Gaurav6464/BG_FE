import React, { useMemo } from "react";
import { 
  Calendar, 
  Users, 
  Activity, 
  UserCheck, 
} from "lucide-react";
import UserService from "../../api/user";
import eventService from "../../api/events";
import { useQuery } from "@tanstack/react-query";
import { useWidgets } from "../../hooks/useGetWidGets";
import type { User } from "../../types/user.type";
import type { Event } from "../../types/event.type";
import type {
  StatCard,
} from "../../types/Dashboard";
import { ErrorState, LoadingSkeleton } from "../../components/dashboard/ErroreAndLoading";
import HeaderCard from "../../components/dashboard/HeaderCard";
import NoWidgetsMessage from "../../components/dashboard/NoWidgetsMessage";
import WidgetRenderer from "../../components/dashboard/WidgetRenderer";


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
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    widgetData,
    isLoading: widgetsLoading,
    error: widgetError,
  } = useWidgets();

  // Memoized computations for better performance
  const chartData = useMemo(() => {
    const eventsByType = events.reduce<Record<string, number>>((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {});

    const eventsByStatus = events.reduce<Record<string, number>>((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {});

    const onlineOfflineData = events.reduce<Record<string, number>>((acc, e) => {
      const key = e.isOnline ? "Online" : "Offline";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const userRoleData = users.reduce<Record<string, number>>((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});

    const verificationData = users.reduce<Record<string, number>>((acc, u) => {
      const key = u.isVerified ? "Verified" : "Unverified";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return {
      eventTypeData: Object.entries(eventsByType).map(([type, count]) => ({ 
        type: cap(type), 
        count,
        percentage: Math.round((count / events.length) * 100)
      })),
      eventStatusData: Object.entries(eventsByStatus).map(([status, count]) => ({ 
        status: cap(status), 
        count,
        percentage: Math.round((count / events.length) * 100)
      })),
      onlineOfflineData: Object.entries(onlineOfflineData).map(([mode, count]) => ({ 
        mode, 
        count,
        percentage: Math.round((count / events.length) * 100)
      })),
      userRoleData: Object.entries(userRoleData).map(([role, count]) => ({ 
        role: cap(role), 
        count,
        percentage: Math.round((count / users.length) * 100)
      })),
      verificationChartData: Object.entries(verificationData).map(([status, count]) => ({ 
        status, 
        count,
        percentage: Math.round((count / users.length) * 100)
      })),
    };
  }, [events, users]);

  const stats: StatCard[] = useMemo(() => [
    {
      title: "Total Events",
      value: events.length,
      icon: Calendar,
      color: "from-indigo-500 to-indigo-600",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Verified Users",
      value: users.filter((u) => u.isVerified).length,
      icon: UserCheck,
      color: "from-purple-500 to-purple-600",
      change: "+15%",
      trend: "up"
    },
    {
      title: "Online Events",
      value: events.filter((e) => e.isOnline).length,
      icon: Activity,
      color: "from-orange-500 to-orange-600",
      change: "+5%",
      trend: "up"
    },
  ], [events, users]);

  const loading = eventsLoading || usersLoading || widgetsLoading;
  const error = eventsError || usersError || widgetError;

  const widgets = widgetData?.widgets || [];
  const visibleWidgets = widgets
    .filter((w: any) => w.visible)
    .sort((a: any, b: any) => a.order - b.order)
    .map((w: any) => w.key);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        <HeaderCard />

        {visibleWidgets.length === 0 && <NoWidgetsMessage />}

        {visibleWidgets.map((widgetKey: any) => (
          <WidgetRenderer 
            key={widgetKey} 
            widgetKey={widgetKey} 
            stats={stats}
            chartData={chartData}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;