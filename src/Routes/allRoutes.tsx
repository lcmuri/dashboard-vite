import CreateMedicine from "../pages/IMS/Medicine/CreateMedicine";

const authProtectedRoutes = [
  { path: "/create-medicine", component: <CreateMedicine /> },
];

export { authProtectedRoutes };
