#!/bin/bash

echo ">>> Atualizando e instalando Nginx..."
apt-get update
apt-get install -y nginx

echo ">>> Configurando o Nginx usando o arquivo local..."
# Remove a configuração padrão
rm /etc/nginx/sites-enabled/default

# Copia o arquivo de configuração no lugar certo
cp /vagrant_nginx/lanchonete.conf /etc/nginx/sites-available/lanchonete.conf

# Ativa a nova configuração
ln -s /etc/nginx/sites-available/lanchonete.conf /etc/nginx/sites-enabled/

echo ">>> Reiniciando o Nginx..."
systemctl restart nginx