import mysql from 'mysql2/promise';

// Vercel functions are serverless & short-lived, so we keep the pool small
// and cache it on the global object to survive warm invocations.
declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5, // keep low — shared hosting caps concurrent connections
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined
  });
}

export function getPool() {
  if (!global._mysqlPool) {
    global._mysqlPool = createPool();
  }
  return global._mysqlPool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
