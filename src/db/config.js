require("dotenv").config();
const { Pool } = require("pg");

//BANCO EM NUVEM
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL, // Use variável de ambiente para a URL de conexão
//   ssl: {
//     rejectUnauthorized: true,
//   },
// });

// //BANCO LOCAL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use variável de ambiente para a URL de conexão
  ssl: false, // Desabilita o SSL
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
    return;
  }

  client.query("SELECT now()", (err, result) => {
    release();
    if (err) {
      console.error("Error executing query", err.stack);
      return;
    }
    console.log(result.rows);
  });
});

module.exports = pool;
