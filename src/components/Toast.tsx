import { Toaster } from "react-hot-toast";

export const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0f172a", // slate-900
          color: "#f8fafc", // slate-50
          border: "1px solid #1e293b", // slate-800
          fontSize: "14px",
          borderRadius: "12px",
        },
        success: {
          iconTheme: {
            primary: "#3b82f6", // blue-500 (seu padrão)
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", // red-500
            secondary: "#fff",
          },
        },
      }}
    />
  );
};
