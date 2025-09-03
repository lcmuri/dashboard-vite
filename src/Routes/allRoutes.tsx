import CategoryList from "@/pages/IMS/Medicine/Category/CategoryList";
import Starter from "@/pages/Pages/Starter";
import { Navigate } from "react-router";
// import CreateMedicine from "../pages/IMS/Medicine/CreateMedicine";

const authProtectedRoutes = [
  // { path: "/create-medicine", component: <CreateMedicine /> },
  { path: "/category-list", component: <CategoryList /> },
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
