import app from "./app";
import { pool } from "./config/database";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  try {
    const conn = await pool.getConnection();
    conn.release();
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log("Server started on port " + env.port);
  });
}

void startServer();
