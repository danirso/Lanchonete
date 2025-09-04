#!/bin/bash

echo ">>> Atualizando e instalando MySQL Server..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y mysql-server

echo ">>> Configurando MySQL para aceitar conexões externas..."
sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql

echo ">>> Criando banco de dados e usuário..."
mysql -u root <<-EOF
CREATE DATABASE lanchonete;
CREATE USER 'lanchonete'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON lanchonete.* TO 'lanchonete'@'%';
FLUSH PRIVILEGES;
EOF

echo ">>> Criando a tabela 'produtos'..."
mysql -u root lanchonete <<-EOF
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  descricao text,
  url text
);
EOF

echo ">>> Banco de dados configurado!"

sudo ip link set eh0 down