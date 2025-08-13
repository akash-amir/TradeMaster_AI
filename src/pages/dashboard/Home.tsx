import DashboardHome from "../../dashboard/components/DashboardHome";
import { useDashboard } from "../../dashboard/context/DashboardContext";

export default function Home() {
  const { trades } = useDashboard();
  return <DashboardHome trades={trades || []} />;
} 