import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MySQL
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Rota de teste
app.get("/api/cardapio", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produtos");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cardápio" });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`🚀 Backend rodando na porta ${process.env.PORT}`);
});
