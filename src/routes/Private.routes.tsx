import { Route } from "react-router-dom";
import UserManagment from "../pages/UserManagemenet/UserManagment";
import Dashboard from "../pages/Dashboard/Dashborad";
import Events from "../pages/Events/Events";

const PrivateRoutes = (
  <>
    <Route path="/" element={<Dashboard />} />
    <Route path="/user-management" element={<UserManagment />} />
    <Route path="/events" element={<Events />} />

  </>
);

export default PrivateRoutes;
