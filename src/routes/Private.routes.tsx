import { Route } from "react-router-dom";
import { lazy } from "react";

// Lazy-loaded components
const Dashboard = lazy(() => import("../pages/Dashboard/Dashborad"));
const UserManagment = lazy(
  () => import("../pages/UserManagemenet/UserManagment")
);
const Events = lazy(() => import("../pages/Events/Events"));

const PrivateRoutes = (
  <>
    <Route path="/" element={<Dashboard />} />
    <Route path="/user-management" element={<UserManagment />} />
    <Route path="/events" element={<Events />} />
  </>
);

export default PrivateRoutes;
