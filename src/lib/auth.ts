import * as bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { getPool } from "./db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const JWT_SECRET_KEY = () =>
  new TextEncoder().encode(process.env["VITE_JWT_SECRET"] || "change-me-in-production-please");
const JWT_EXPIRY = "8h";

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  name: string;
  is_active: boolean;
}

interface AdminUserRow extends RowDataPacket {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  name: string;
  is_active: number;
}

interface LoginAttemptRow extends RowDataPacket {
  attempt_count: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

async function checkRateLimit(emailOrUsername: string, ipAddress?: string): Promise<boolean> {
  const pool = getPool();
  const [rows] = await pool.execute<LoginAttemptRow[]>(
    `SELECT COUNT(*) as attempt_count FROM login_attempts 
     WHERE email = ? AND success = FALSE 
     AND attempted_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
    [emailOrUsername, LOCKOUT_MINUTES],
  );
  return (rows[0]?.attempt_count ?? 0) < MAX_LOGIN_ATTEMPTS;
}

async function recordLoginAttempt(
  emailOrUsername: string,
  success: boolean,
  ipAddress?: string,
): Promise<void> {
  const pool = getPool();
  await pool.execute("INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, ?)", [
    emailOrUsername,
    ipAddress || null,
    success,
  ]);
}

export async function authenticateUser(
  emailOrUsername: string,
  password: string,
  ipAddress?: string,
): Promise<{ token: string; user: AdminUser } | { error: string }> {
  // Rate limiting
  const allowed = await checkRateLimit(emailOrUsername, ipAddress);
  if (!allowed) {
    return { error: "Muitas tentativas de login. Tente novamente em 15 minutos." };
  }

  const pool = getPool();
  const [rows] = await pool.execute<AdminUserRow[]>(
    "SELECT id, email, username, password_hash, name, is_active FROM admin_users WHERE email = ? OR username = ?",
    [emailOrUsername, emailOrUsername],
  );

  const user = rows[0];
  if (!user) {
    await recordLoginAttempt(emailOrUsername, false, ipAddress);
    return { error: "Credenciais inválidas." };
  }

  if (!user.is_active) {
    await recordLoginAttempt(emailOrUsername, false, ipAddress);
    return { error: "Conta desativada. Entre em contato com o administrador." };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    await recordLoginAttempt(emailOrUsername, false, ipAddress);
    return { error: "Credenciais inválidas." };
  }

  await recordLoginAttempt(emailOrUsername, true, ipAddress);

  // Generate JWT
  const token = await new SignJWT({
    sub: String(user.id),
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET_KEY());

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      is_active: Boolean(user.is_active),
    },
  };
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY());
    if (!payload.sub) return null;

    const pool = getPool();
    const [rows] = await pool.execute<AdminUserRow[]>(
      "SELECT id, email, username, name, is_active FROM admin_users WHERE id = ? AND is_active = TRUE",
      [payload.sub],
    );

    const user = rows[0];
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      is_active: Boolean(user.is_active),
    };
  } catch {
    return null;
  }
}
