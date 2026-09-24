/**
 * Run this script to seed the MySQL database with the existing products.
 *
 * Usage:
 *   npx tsx src/scripts/seed.ts
 *
 * Make sure you have:
 * 1. MySQL running
 * 2. Run the schema first: mysql -u root < src/lib/db-schema.sql
 * 3. A .env file with VITE_MYSQL_* variables (or the defaults will be used)
 */

// Load .env
import { config } from "dotenv";
config();

import { seedDatabase } from "../lib/seed-db";

seedDatabase()
  .then(() => {
    console.log("✅ Seed complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
