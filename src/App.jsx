import AppRoutes from "./Sidebar/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import HealthMonitor from "./components/HealthMonitor";

export default function App() {
  return (
    <AuthProvider>
      <div>
        <AppRoutes />
        <HealthMonitor />
      </div>
    </AuthProvider>
  );
}