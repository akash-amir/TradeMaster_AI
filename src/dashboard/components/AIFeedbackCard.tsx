import { Brain, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIFeedbackCardProps {
  trade?: {
    id: string;
    title: string;
    asset: string;
    pnl: number;
    risk: number;
  };
  feedback: {
    type: 'success' | 'warning' | 'improvement';
    title: string;
    message: string;
    score?: number;
  };
  className?: string;
}

export default function AIFeedbackCard({ trade, feedback, className }: AIFeedbackCardProps) {
  const getIcon = () => {
    switch (feedback.type) {
      case 'success':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'improvement':
        return <Target className="h-5 w-5 text-secondary" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  const getBadgeVariant = () => {
    switch (feedback.type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'improvement':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={`glass-card transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-base font-medium">{feedback.title}</span>
          </div>
          {feedback.score && (
            <Badge variant={getBadgeVariant()}>
              Score: {feedback.score}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {trade && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
            <div>
              <p className="font-medium text-foreground text-sm">{trade.title}</p>
              <p className="text-xs text-muted-foreground">{trade.asset}</p>
            </div>
            <div className="text-right">
              <p className={`font-medium text-sm ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${trade.pnl}
              </p>
              <p className="text-xs text-muted-foreground">Risk: {trade.risk}%</p>
            </div>
          </div>
        )}
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feedback.message}
        </p>
        
        <div className="pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Brain className="h-3 w-3" />
            <span>AI Analysis • Generated just now</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}