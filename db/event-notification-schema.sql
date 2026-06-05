CREATE TABLE IF NOT EXISTS partner_events (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(100) UNIQUE NOT NULL,
  correlation_id VARCHAR(100),
  event_type VARCHAR(100) NOT NULL,
  payload JSONB,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_notifications (
  id SERIAL PRIMARY KEY,
  notification_id VARCHAR(100) UNIQUE NOT NULL,
  notification_type VARCHAR(50),
  recipient VARCHAR(255),
  message TEXT,
  source_event JSONB,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);