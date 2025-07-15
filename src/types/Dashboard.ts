export type ChartData = Record<string, string | number>;

export type EventTypeData = ChartData & {
  type: string;
  count: number;
};

export type EventStatusData = ChartData & {
  status: string;
  count: number;
};

export type OnlineOfflineData = ChartData & {
  mode: string;
  count: number;
};

export type UserRoleData = ChartData & {
  role: string;
  count: number;
};

export type VerificationData = ChartData & {
  status: string;
  count: number;
};

export type MonthlyUserData = ChartData & {
  month: string;
  users: number;
};

export type StatCard = {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};
