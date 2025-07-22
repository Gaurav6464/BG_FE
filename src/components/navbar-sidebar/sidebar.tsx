import {
  LayoutDashboard,
  Users,
  Calendar,
//   ExternalLink,
//   Building2,
//   Clock,
//   Bell,
//   FileText,
//   BarChart3,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "User Management", path: "/user-management" },
    { icon: Calendar, label: "Events", path: "/events" },
    // { icon: ExternalLink, label: "External Resources", path: "/external-resources" },
    // { icon: Building2, label: "Organization", path: "/organization" },
    // { icon: Clock, label: "24 Hour Survey", path: "/survey" },
    // { icon: Bell, label: "Notification send", path: "/notifications" },
    // { icon: FileText, label: "Export Reports", path: "/reports" },
    // { icon: BarChart3, label: "App Counts", path: "/app-counts" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div>
            <div className="text-sm font-semibold">BG</div>
            <div className="text-xs text-gray-300">BRAIN GYM</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname ===item.path;

            return (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white border-r-2 border-blue-500"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
