import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import useUserDetails from "../../hooks/useUserDetails";
import { useNavigate } from "react-router-dom";
import ManageWidgetsDrawer from "../dashboardwidgets/ManageWidgetsDrawer";


const Navbar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();

  const { data, isLoading, isError } = useUserDetails();


  if (isLoading) return <p>Loading user...</p>;
  if (isError || !data) return <p>Failed to load user</p>;

  const logout = () => {
    localStorage.removeItem("isLogin");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left side - Greeting and breadcrumb */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-900">Welcome Back!!</h1>
        <p className="text-sm text-gray-500">{data.user.fullName}</p>
      </div>

      {/* Right side - User Profile */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium border border-blue-600 text-blue-600 rounded-md shadow-sm hover:bg-blue-50 hover:shadow-md transition"
        >
          <span className="text-lg">🎛️</span>
          Manage Widgets
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {data.user.fullName.split(" ")[0].charAt(0).toUpperCase()}
            </div>

            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <div className="font-medium">{data.user.fullName}</div>
                  <div className="text-xs text-gray-500">{data.user.role}</div>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}

      <ManageWidgetsDrawer isOpen={isOpen} setIsOpen={setIsOpen}/>
    </header>
  );
};

export default Navbar;
