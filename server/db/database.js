import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'giaa.db');

let db = null;

export async function initDb() {
  const SQL = await initSqlJs();

  // Try loading existing database
  try {
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }
  } catch {
    db = new SQL.Database();
  }

  initSchema();
  saveDb();
  console.log('✓ Database initialized');
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

export function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

function initSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('ADMIN','MANAGER','VIEWER')),
      phone TEXT,
      avatar TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      last_login TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS grants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      organization TEXT NOT NULL,
      amount_min REAL DEFAULT 0,
      amount_max REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      deadline TEXT,
      description TEXT,
      eligibility TEXT DEFAULT '[]',
      category TEXT DEFAULT 'GENERAL',
      relevance_score TEXT DEFAULT 'MEDIUM',
      status TEXT DEFAULT 'NEW',
      requirements TEXT DEFAULT '[]',
      documents TEXT DEFAULT '[]',
      contact_email TEXT,
      website_url TEXT,
      ai_summary TEXT,
      readiness_score INTEGER DEFAULT 0,
      readiness_missing TEXT DEFAULT '[]',
      readiness_strengths TEXT DEFAULT '[]',
      readiness_recommendations TEXT DEFAULT '[]',
      estimated_success_rate INTEGER DEFAULT 0,
      source TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grant_id INTEGER REFERENCES grants(id),
      user_id INTEGER REFERENCES users(id),
      title TEXT NOT NULL,
      content TEXT DEFAULT '[]',
      status TEXT DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','REVIEW','FINAL','SUBMITTED')),
      ai_generated INTEGER DEFAULT 0,
      version INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      data TEXT DEFAULT '{}',
      read INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'MEDIUM',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS agent_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      status TEXT DEFAULT 'RUNNING',
      details TEXT,
      grants_found INTEGER DEFAULT 0,
      grants_matched INTEGER DEFAULT 0,
      error TEXT,
      started_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS school_profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  console.log('✓ Database schema initialized');
}

// Helper wrappers to match the old better-sqlite3 API patterns
// db.prepare(sql).get(...params) -> dbGet(sql, params)
// db.prepare(sql).all(...params) -> dbAll(sql, params)
// db.prepare(sql).run(...params) -> dbRun(sql, params)

export function dbGet(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

export function dbAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function dbRun(sql, params = []) {
  db.run(sql, params);
  saveDb();
  // Simulate lastInsertRowid
  const result = dbGet('SELECT last_insert_rowid() as id');
  return { lastInsertRowid: result ? result.id : 0 };
}

export default { initDb, getDb, saveDb, dbGet, dbAll, dbRun };
