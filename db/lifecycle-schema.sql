CREATE TABLE IF NOT EXISTS partner_connectivity (
    id SERIAL PRIMARY KEY,
    partner_id VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50),
    sandbox_access BOOLEAN,
    ip_whitelisted BOOLEAN,
    certificate_exchanged BOOLEAN,
    api_gateway_access BOOLEAN,
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_connectivity_partner_id
    ON partner_connectivity(partner_id);

CREATE TABLE IF NOT EXISTS partner_testing (
    id SERIAL PRIMARY KEY,
    partner_id VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50),
    total_test_cases INTEGER,
    passed INTEGER,
    failed INTEGER,
    blocked INTEGER,
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_testing_partner_id
    ON partner_testing(partner_id);

CREATE TABLE IF NOT EXISTS partner_certification (
    id SERIAL PRIMARY KEY,
    partner_id VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50),
    certified_products JSONB,
    certification_date TIMESTAMP,
    approver VARCHAR(255),
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_certification_partner_id
    ON partner_certification(partner_id);

CREATE TABLE IF NOT EXISTS partner_go_live (
    id SERIAL PRIMARY KEY,
    partner_id VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50),
    production_date TIMESTAMP,
    business_approval BOOLEAN,
    technology_approval BOOLEAN,
    operations_approval BOOLEAN,
    rollback_plan_ready BOOLEAN,
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_go_live_partner_id
    ON partner_go_live(partner_id);

CREATE TABLE IF NOT EXISTS partner_lifecycle_history (
    id SERIAL PRIMARY KEY,
    partner_id VARCHAR(50) NOT NULL,
    stage VARCHAR(50) NOT NULL,
    status VARCHAR(50),
    details JSONB,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
