import { Outlet } from "react-router-dom";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { Toast } from "./components/Toast";

export function App() {
  return (
    <>
      <Toast />
      <div className="flex font-inter bg-slate-950 antialiased">
        <aside>
          <Sidebar />
        </aside>

        <main className="w-full h-screen bg-slate-900">
          <Outlet />
        </main>
      </div>
    </>
  );
}
