import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log("📦 Conectado ao banco, iniciando seed...");


    await db.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        descricao TEXT,
        url TEXT,
      );
    `);

    await db.query("DELETE FROM produtos");


    const produtos = [
      ["X-Burguer", 15.00],
      ["X-Salada", 18.00],
      ["X-Bacon", 20.00],
      ["Refrigerante Lata", 6.00],
      ["Batata Frita", 12.00]
    ];

    for (const [nome, preco] of produtos) {
      await db.query("INSERT INTO produtos (nome, preco) VALUES (?, ?)", [nome, preco]);
    }

    console.log("✅ Seed finalizado com sucesso!");
    await db.end();

  } catch (err) {
    console.error("❌ Erro no seed:", err);
  }
}

seed();
