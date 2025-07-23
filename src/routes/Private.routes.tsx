import { Route } from "react-router-dom";
import { lazy } from "react";
const ExternalResourcePage = lazy(()=>import("../pages/externalResource/ExternalResourcePage")) 
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
    <Route path="/external-resources" element={<ExternalResourcePage />} />
  </>
);

export default PrivateRoutes;
