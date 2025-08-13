import TradeEntryForm from "../../dashboard/components/TradeEntryForm";
import { useDashboard } from "../../dashboard/context/DashboardContext";
import { useNavigate } from "react-router-dom";

export default function LogTrades() {
  const { addTrade } = useDashboard();
  const navigate = useNavigate();

  const handleTradeAdded = async (tradeData: any) => {
    await addTrade(tradeData);
    navigate('/dashboard/records');
  };

  return <TradeEntryForm onTradeAdded={handleTradeAdded} />;
} 