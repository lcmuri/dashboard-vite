import Starter from "@/pages/Pages/Starter";
import CreateMedicine from "../pages/IMS/Medicine/CreateMedicine";
import { Navigate } from "react-router";

const authProtectedRoutes = [
  { path: "/create-medicine", component: <CreateMedicine /> },
  { path: "/dashboard", component: <Starter /> },
  { path: "/index", component: <Starter /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

export { authProtectedRoutes };
