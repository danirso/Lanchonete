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
      ["X-Burguer", 15.00, "Delicioso X-Burguer padrão, o famoso pão, carne e queijo.","https://alloydeliveryimages.s3.sa-east-1.amazonaws.com/item_images/7290/64cebbbf5e9386fmo7.webp"],
      ["X-Salada", 18.00,"Delicioso hambúrguer suculento acompanhado de queijo, alface fresquinha, tomate, cebola e molho especial da casa, servido no pão macio e quentinho.","https://img.cybercook.com.br/receitas/151/x-salada-3.jpeg"],
      ["X-Bacon", 20.00, "O X-Bacon é um sanduíche focado na harmonia entre a carne suculenta, o queijo derretido, a crocância salgada do bacon e um toque especial de maionese da casa.","https://www.sadia.com.br/assets/images/_/recipes/156865d1458cb070f06218cd0ecbea1adac7fb35.webp?1753974418648"],
      ["Refrigerante Lata", 6.00,"Refrigerante geladinho para acompanhar seu rango!","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtIy-iAAvSfzAF1fJ-M16YnPI0e8vwG7-zMw&s"],
      ["Batata Frita", 12.00,"A batata frita é um clássico universal e irresistível. É um acompanhamento ou petisco feito de batatas cortadas em palitos, fritas em óleo até ficarem crocantes por fora e macias por dentro. Com um toque de sal, a batata frita se torna a combinação perfeita de textura e sabor, pronta para ser servida.","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYUht9jih-hA3Skf2VxgMdlBRCiS7P7QtOUQ&s"],
      ["Cookies do Gutoão", 10.00, "Deu vontade de um doce? O Gutão resolve! Nossos cookies são a pedida certa pra matar sua fome de algo delicioso. Receita caprichada, sabor de verdade e muito chocolate. É só pedir que a felicidade chega quentinha aí na sua porta!","blob:https://web.whatsapp.com/2d6def01-c332-4195-836d-0fbe1495b3ec"]
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
