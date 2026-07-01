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

CREATE TABLE IF NOT EXISTS event_outbox (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(100) UNIQUE NOT NULL,
  topic VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_outbox_status_created_at
  ON event_outbox(status, created_at);

CREATE TABLE IF NOT EXISTS event_dead_letters (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(100),
  source VARCHAR(100) NOT NULL,
  topic VARCHAR(100),
  event_type VARCHAR(100),
  payload JSONB,
  error_message TEXT,
  failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_dead_letters_failed_at
  ON event_dead_letters(failed_at);
