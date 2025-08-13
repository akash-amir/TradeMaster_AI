import TradeRecordsTable from "../../dashboard/components/TradeRecordsTable";
import { useDashboard } from "../../dashboard/context/DashboardContext";

export default function Records() {
  const { trades, analyzeTradeWithAI, deleteTrade, updateTrade } = useDashboard();
  
  return (
    <TradeRecordsTable 
      trades={trades} 
      onAnalyzeTrade={analyzeTradeWithAI}
      onDeleteTrade={deleteTrade}
      onUpdateTrade={updateTrade}
    />
  );
} 