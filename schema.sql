-- D1 schema for AppWarehouse

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  referral_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS points (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tunnel_usage (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  points_consumed INTEGER DEFAULT 1,
  auto_renew BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS app_collections (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  app_name TEXT NOT NULL,
  app_version TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  inviter_user_id TEXT REFERENCES users(id),
  invited_user_id TEXT REFERENCES users(id),
  click_count INTEGER DEFAULT 0,
  signup_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

