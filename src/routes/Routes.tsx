import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./Public.routes";
import PrivateRoutes from "./Private.routes";
import Layout from "../layout/Layout";
import RequireAuth from "./RequireAuth";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {PublicRoutes}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        {PrivateRoutes}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
