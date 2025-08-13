import { Target, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Goal {
  id: string;
  title: string;
  type: 'pnl' | 'winrate' | 'trades';
  target: number;
  current: number;
  period: 'weekly' | 'monthly';
  deadline: string;
}

interface GoalTrackerProps {
  goals: Goal[];
  className?: string;
}

export default function GoalTracker({ goals, className }: GoalTrackerProps) {
  const getIcon = (type: Goal['type']) => {
    switch (type) {
      case 'pnl':
        return <DollarSign className="h-4 w-4" />;
      case 'winrate':
        return <TrendingUp className="h-4 w-4" />;
      case 'trades':
        return <Target className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const formatValue = (value: number, type: Goal['type']) => {
    switch (type) {
      case 'pnl':
        return `$${value}`;
      case 'winrate':
        return `${value}%`;
      case 'trades':
        return `${value} trades`;
      default:
        return value.toString();
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-secondary';
    return 'bg-primary';
  };

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Trading Goals
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Goals Set</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Set trading goals to track your progress and stay motivated
            </p>
            <Button variant="premium" size="sm">
              Set Your First Goal
            </Button>
          </div>
        ) : (
          <>
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current, goal.target);
              const isCompleted = progress >= 100;
              
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg border border-border bg-card/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getIcon(goal.type)}
                      <span className="font-medium text-foreground">{goal.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground capitalize">
                        {goal.period}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className={`font-medium ${isCompleted ? 'text-success' : 'text-foreground'}`}>
                        {formatValue(goal.current, goal.type)} / {formatValue(goal.target, goal.type)}
                      </span>
                    </div>
                    
                    <div className="relative">
                      <Progress 
                        value={progress} 
                        className="h-2 bg-muted"
                      />
                      <div 
                        className={`absolute inset-0 h-2 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {progress.toFixed(1)}% complete
                      </span>
                      {isCompleted && (
                        <span className="text-success font-medium">✓ Goal achieved!</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
            
            <Button variant="glass" size="sm" className="w-full">
              Add New Goal
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}