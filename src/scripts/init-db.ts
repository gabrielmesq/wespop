import { config } from "dotenv";
config();

import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function initDatabase() {
  const host = process.env.VITE_MYSQL_HOST || "localhost";
  const port = Number(process.env.VITE_MYSQL_PORT) || 3306;
  const user = process.env.VITE_MYSQL_USER || "root";
  const password = process.env.VITE_MYSQL_PASSWORD || "";

  console.log(`Conectando ao MySQL em ${host}:${port} como usuário '${user}'...`);

  try {
    // 1. Conecta sem especificar o banco (para poder criá-lo)
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true, // Permite rodar múltiplas queries de uma vez
    });

    console.log("✅ Conectado ao MySQL com sucesso!");

    // 2. Lê o arquivo SQL
    const schemaPath = path.join(process.cwd(), "src", "lib", "db-schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    console.log("Executando migrações do banco de dados...");

    // 3. Executa todo o SQL
    await connection.query(sql);

    console.log("✅ Banco de dados e tabelas criados com sucesso!");

    await connection.end();
  } catch (error: unknown) {
    console.error("❌ Erro ao inicializar o banco de dados:");
    const err = error as { code?: string; message?: string };
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error(
        `\nAcesso negado para o usuário '${user}'. Verifique se a senha no arquivo .env (VITE_MYSQL_PASSWORD) está correta.`,
      );
    } else if (error.code === "ECONNREFUSED") {
      console.error(
        `\nNão foi possível conectar ao MySQL em ${host}:${port}. O serviço do MySQL está rodando?`,
      );
    } else {
      console.error(error.message || error);
    }
    process.exit(1);
  }
}

initDatabase();
