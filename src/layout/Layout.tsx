import { Outlet } from "react-router-dom";
import Sidebar from "../components/navbar-sidebar/sidebar";
import Navbar from "../components/navbar-sidebar/navbar";
// import Navbar from "../components/Navbar"; // if you have one

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Page Content */}
        <main className="flex-1 overflow-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
