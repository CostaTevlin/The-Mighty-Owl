CREATE TABLE purchase_intents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  device_id TEXT NOT NULL,
  product TEXT NOT NULL,
  credits_granted INTEGER NOT NULL,
  price_shown TEXT NOT NULL
);
CREATE INDEX idx_purchase_intents_device ON purchase_intents(device_id);
CREATE INDEX idx_purchase_intents_created ON purchase_intents(created_at DESC);
