-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trades table to store user trade entries
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_pair TEXT NOT NULL,
  entry_price DECIMAL(10,5) NOT NULL,
  exit_price DECIMAL(10,5),
  lot_size DECIMAL(8,2) NOT NULL,
  timeframe TEXT NOT NULL,
  trade_type TEXT NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  chart_screenshot_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI analysis table to store analysis results
CREATE TABLE public.ai_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_id UUID NOT NULL REFERENCES public.trades(id) ON DELETE CASCADE,
  analysis_text TEXT NOT NULL,
  insights JSONB,
  recommendations TEXT[],
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for trades
CREATE POLICY "Users can view own trades" ON public.trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON public.trades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades" ON public.trades
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for AI analysis
CREATE POLICY "Users can view analysis of own trades" ON public.ai_analysis
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trades 
      WHERE trades.id = ai_analysis.trade_id 
      AND trades.user_id = auth.uid()
    )
  );

CREATE POLICY "Service can insert analysis" ON public.ai_analysis
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON public.trades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Allow high-value assets (e.g., Bitcoin) by increasing numeric precision
ALTER TABLE trades
  ALTER COLUMN entry_price TYPE numeric(20,8),
  ALTER COLUMN exit_price TYPE numeric(20,8),
  ALTER COLUMN stop_loss TYPE numeric(20,8),
  ALTER COLUMN take_profit TYPE numeric(20,8),
  ALTER COLUMN lot_size TYPE numeric(20,8);