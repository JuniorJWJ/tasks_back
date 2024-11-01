const db = require("./config");

const initNewDb = {
  async init() {
    const client = await db.connect();
    console.log("Connected to the database");

    try {
      await client.query("BEGIN");

      // Table for Tasks
      await client.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL UNIQUE,
          cost NUMERIC(10, 2),
          due_date TIMESTAMP,
          order_field INT NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Table tasks checked/created");

      
      await client.query("COMMIT");
      console.log("Transaction committed");
    } catch (e) {
      await client.query("ROLLBACK");
      console.error("Error executing query", e.stack);
    } finally {
      client.release();
      console.log("Client released");
    }
  },
};

initNewDb.init();
