#!/bin/bash

echo ">>> Atualizando e instalando Nginx..."
apt-get update
apt-get install -y nginx

echo ">>> Configurando o Nginx usando o arquivo local..."

rm /etc/nginx/sites-enabled/default


cp /vagrant_nginx/lanchonete.conf /etc/nginx/sites-available/lanchonete.conf


ln -s /etc/nginx/sites-available/lanchonete.conf /etc/nginx/sites-enabled/

echo ">>> Reiniciando o Nginx..."
systemctl restart nginx