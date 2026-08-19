import { useState } from "react";
import { useToasts } from "./lib/useToasts";
import ToastStack from "./components/ToastStack";
import Landing from "./views/Landing";
import Dashboard from "./views/Dashboard";

export default function App() {
  const [route, setRoute] = useState<"landing" | "dashboard">("landing");
  const { toasts, push } = useToasts();

  return (
    <div className="rs-root min-h-screen">
      {route === "landing" ? (
        <Landing onLaunch={() => setRoute("dashboard")} />
      ) : (
        <Dashboard onBack={() => setRoute("landing")} pushToast={push} />
      )}
      <ToastStack toasts={toasts} />
    </div>
  );
}
