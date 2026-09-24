import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env["VITE_MYSQL_HOST"] || "localhost",
      port: Number(process.env["VITE_MYSQL_PORT"]) || 3306,
      database: process.env["VITE_MYSQL_DATABASE"] || "wespop",
      user: process.env["VITE_MYSQL_USER"] || "root",
      password: process.env["VITE_MYSQL_PASSWORD"] || "",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.VITE_MYSQL_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}
