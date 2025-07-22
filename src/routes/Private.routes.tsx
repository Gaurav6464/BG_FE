import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy-loaded components
const Dashboard = lazy(() => import("../pages/Dashboard/Dashborad"));
const UserManagment = lazy(() => import("../pages/UserManagemenet/UserManagment"));
const Events = lazy(() => import("../pages/Events/Events"));

const Loading = () => (
  <div className="flex items-center justify-center h-screen w-full bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-solid"></div>
  </div>
);



const PrivateRoutes = (
  <Suspense fallback={<Loading />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/user-management" element={<UserManagment />} />
    <Route path="/events" element={<Events />} />
  </Suspense>
);

export default PrivateRoutes;
