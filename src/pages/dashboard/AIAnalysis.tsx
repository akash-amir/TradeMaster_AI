import AIAnalysisSection from "../../dashboard/components/AIAnalysisSection";
import { useDashboard } from "../../dashboard/context/DashboardContext";

export default function AIAnalysis() {
  const { trades, analyses } = useDashboard();
  return <AIAnalysisSection trades={trades} analyses={analyses} />;
} 