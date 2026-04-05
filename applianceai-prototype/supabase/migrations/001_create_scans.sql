-- Create scans table for ApplianceAI
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  task TEXT NOT NULL,
  context JSONB,
  appliance_model TEXT,
  confidence TEXT,
  instructions JSONB,
  safety_tips JSONB,
  estimated_time TEXT,
  user_id TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_task ON scans(task);
