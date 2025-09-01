#!/bin/bash

echo ">>> Atualizando pacotes e instalando Git (necessário para o NVM)..."
apt-get update -y
apt-get install -y git curl build-essential

echo ">>> Criando arquivo .env para o backend..."

ENV_FILE="/home/vagrant/app/backend/.env"
ENV_EXAMPLE_FILE="/home/vagrant/app/backend/.env.example"


if [ ! -f "$ENV_FILE" ]; then
    if [ -f "$ENV_EXAMPLE_FILE" ]; then
        echo ".env não encontrado. Copiando de .env.example..."
        cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
    else
        echo ".env e .env.example não encontrados. Criando .env vazio..."
        touch "$ENV_FILE"
    fi
fi


update_env_var() {
    local VAR_NAME=$1
    local VAR_VALUE=$2
    local ENV_FILE_PATH=$3

    if grep -q "^${VAR_NAME}=" "$ENV_FILE_PATH"; then
        sed -i "s/^${VAR_NAME}=.*/${VAR_NAME}=${VAR_VALUE}/" "$ENV_FILE_PATH"
        echo "Variável '${VAR_NAME}' atualizada no .env."
    else
        echo "${VAR_NAME}=${VAR_VALUE}" >> "$ENV_FILE_PATH"
        echo "Variável '${VAR_NAME}' adicionada ao .env."
    fi
}

update_env_var "DB_HOST" "192.168.56.12" "$ENV_FILE"
update_env_var "DB_USER" "lanchonete" "$ENV_FILE"
update_env_var "DB_PASS" "123456" "$ENV_FILE"
update_env_var "DB_NAME" "lanchonete" "$ENV_FILE"
update_env_var "PORT" "4000" "$ENV_FILE"
        
chown vagrant:vagrant "$ENV_FILE"

echo ">>> Executando instalação do NVM, Node, PM2 e dependências como usuário 'vagrant'..."
sudo -u vagrant bash <<'EOF'
export HOME=/home/vagrant

# Instala o NVM clonando o repositório e rodando o script de instalação
git clone https://github.com/nvm-sh/nvm.git "$HOME/.nvm"
cd "$HOME/.nvm"
git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
\. "$HOME/.nvm/nvm.sh"

# Adiciona o NVM ao .bashrc para futuras sessões
echo '' >> "$HOME/.bashrc"
echo '# Configuração do NVM' >> "$HOME/.bashrc"
echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.bashrc"
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.bashrc"

# Instala a versão do Node.js especificada
nvm install 18.20.8

# Define a versão padrão
nvm alias default 18.20.8

# Instala as dependências do projeto
cd /home/vagrant/app
npm install --prefix backend
npm install --prefix frontend

# Instala e configura o PM2
npm install -g pm2
pm2 start "npm run dev --prefix backend" --name "backend"
pm2 start "npm run dev --prefix frontend" --name "frontend"
pm2 save

EOF

echo ">>> Configurando o serviço de inicialização do PM2..."

GENERATED_CMD=$(sudo -u vagrant bash -c 'export HOME=/home/vagrant; export NVM_DIR="/home/vagrant/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; pm2 startup systemd -u vagrant --hp /home/vagrant')
sudo -E bash -c "$GENERATED_CMD"

echo ">>> Ambiente da aplicação configurado com sucesso!"