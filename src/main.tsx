import "./index.css";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";
import { ListClients } from "./routes/ListClients";
import { Dashboard } from "./routes/Dashboard";
import { ListCtes } from "./routes/ListCtes";
import { CreatePending } from "./routes/CreatePending";
import { Settings } from "./routes/Settings";
import { SignIn } from "./routes/SignIn";
import { SignUp } from "./routes/SignUp";
import { AuthProvider, useAuth } from "./components/AuthContext";
import {
  Outlet,
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Financial } from "./routes/Financial";
import { Toast } from "./components/Toast";

// 1. Rota Protegida Geral (Verifica apenas login)
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse">Sincronizando sessão...</p>
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

// 2. Rota Protegida para Admin (Verifica Login + Role DEV)
const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth(); // Certifique-se que o useAuth retorna o 'user'

  if (loading) return null;

  // Se logado MAS não for DEV, joga para o dashboard
  if (isAuthenticated && user?.role !== "DEV") {
    return <Navigate to="/dashboard" replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "list-clients", element: <ListClients /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "register-cte", element: <CreatePending /> },
          { path: "list-ctes", element: <ListCtes /> },
          { path: "financial", element: <Financial /> },
          // 3. Movemos o settings para dentro de um grupo protegido por cargo
          {
            element: <AdminRoute />,
            children: [{ path: "settings", element: <Settings /> }],
          },
        ],
      },
    ],
  },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  { path: "*", element: <Navigate to="/signin" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Toast />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
