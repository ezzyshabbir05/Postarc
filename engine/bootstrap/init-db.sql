-- =============================================================================
-- Postarc Enterprise Mail Server - Database Initialization
-- =============================================================================

-- Enable cryptographic and UUID extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure database permissions
GRANT ALL PRIVILEGES ON DATABASE postarc TO postarc;
