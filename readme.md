# Projeto Lanchonete (Ambiente de Desenvolvimento com Vagrant)

Este repositório contém o código-fonte e a configuração de ambiente para o projeto Lanchonete. O ambiente é totalmente automatizado utilizando Vagrant e VirtualBox, criando uma arquitetura de 3 máquinas virtuais isoladas que se comunicam através de uma rede privada.

## Arquitetura e Fluxo de Comunicação

O projeto é dividido em três máquinas virtuais (VMs) que formam uma arquitetura de 3 camadas, conectadas por uma rede interna (`10.0.0.0/24`) para garantir a segurança e o isolamento dos serviços. O fluxo de uma requisição do usuário é o seguinte:

`Usuário (Navegador) → VM proxy → VM app (Frontend → Backend) → VM db`

Aqui está o detalhe de cada componente:

* **VM `proxy` (Nginx - O Ponto de Entrada)**
    * **IP:** `10.0.0.10`
    * **Responsabilidade:** É a única porta de entrada da aplicação, recebendo todo o tráfego do usuário através do endereço `http://localhost:8080`.
    * **Ação:** Atua como um proxy reverso que encaminha **todas as requisições** exclusivamente para o **Serviço de Frontend** na VM `app`. Esta VM não tem conhecimento direto do backend ou do banco de dados.

* **VM `app` (Node.js/React - O Cérebro da Aplicação)**
    * **IP:** `10.0.0.20`
    * **Responsabilidade:** Hospeda os dois serviços principais da aplicação.
    * **Serviço de Frontend (React + Vite):** Roda na porta `3000`. Recebe as requisições do Nginx, renderiza a interface para o usuário e, quando precisa de dados (ex: carregar o cardápio), faz uma chamada de API. O servidor de desenvolvimento do Vite intercepta essa chamada e a repassa para o serviço de Backend na mesma VM.
    * **Serviço de Backend (Node.js + Express):** Roda na porta `4000`. Recebe requisições **apenas** do serviço de Frontend. É responsável por toda a lógica de negócio e se comunica com a `VM db` para persistir e consultar dados.

* **VM `db` (MySQL - O Armazenamento Seguro)**
    * **IP:** `10.0.0.30`
    * **Responsabilidade:** Máquina dedicada exclusivamente ao banco de dados MySQL.
    * **Ação:** Aceita conexões apenas da `VM app` (Backend) através da rede privada, garantindo que o banco de dados não fique exposto à internet ou a outras partes da infraestrutura.

## Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados em seu computador:

* [**Git**](https://git-scm.com/downloads)
* [**Vagrant**](https://developer.hashicorp.com/vagrant/downloads)
* **[VirtualBox 6.1 ou superior](https://www.virtualbox.org/wiki/Downloads)** (Este projeto está configurado para usar o VirtualBox como provedor de virtualização.)
* **Rsync** (Para sincronização de arquivos):
    * **Usuários macOS e Linux:** Geralmente já vem instalado.
    * **Usuários Windows:** O `rsync` não vem instalado por padrão. A forma mais fácil de obtê-lo é instalando o **[Git for Windows](https://git-scm.com/downloads)** e garantindo que suas ferramentas de linha de comando (`Git Bash` e `Unix tools`) sejam adicionadas ao PATH do sistema durante a instalação.

## Como Rodar o Projeto

Com os pré-requisitos instalados, siga os passos abaixo para iniciar o ambiente completo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/danirso/Lanchonete.git
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd Lanchonete
    ```

3.  **Inicie o ambiente com Vagrant:**
    ```bash
    vagrant up
    ```
    Este único comando fará tudo por você, incluindo baixar o sistema operacional, criar as 3 VMs e rodar todos os scripts de configuração.

    > **Nota:** A primeira vez que você rodar o `vagrant up`, o processo pode levar bastante tempo, dependendo da sua conexão com a internet e do desempenho do seu computador. Pegue um café! ☕

## Fluxo de Trabalho de Desenvolvimento (Importante!)

Este projeto utiliza `rsync` para sincronizar os arquivos da sua máquina para a VM `app`. Isso resolve problemas de compatibilidade com Windows, mas muda um pouco o fluxo de trabalho.

As alterações feitas nos seus arquivos **não são refletidas instantaneamente** na VM. Para sincronizar suas alterações enquanto você desenvolve, você precisa usar um processo contínuo em um segundo terminal.

**O fluxo ideal é:**

1.  **Abra um primeiro terminal** para usar os comandos principais do Vagrant (`vagrant up`, `vagrant halt`, `vagrant ssh`, etc.).

2.  **Abra um segundo terminal**, navegue até a pasta do projeto e execute:
    ```bash
    vagrant rsync-auto
    ```

3.  **Deixe o segundo terminal (com `rsync-auto`) rodando o tempo todo** enquanto você trabalha no código. Ele ficará monitorando seus arquivos e irá copiá-los para a VM `app` toda vez que você salvar uma alteração.

## Acessando a Aplicação

Após o comando `vagrant up` ser concluído, a aplicação estará no ar.

Abra seu navegador e acesse: **[http://localhost:8080](http://localhost:8080)**

Este endereço aponta para o proxy reverso (Nginx), que direciona o tráfego para o frontend da aplicação de forma transparente.

## Gerenciando o Ambiente

* **Ligar o ambiente:**
    ```bash
    vagrant up
    ```
* **Desligar o ambiente (de forma segura):**
    ```bash
    vagrant halt
    ```
* **Verificar o status das máquinas:**
    ```bash
    vagrant status
    ```
* **Acessar o terminal de uma das máquinas (via SSH):**
    ```bash
    vagrant ssh proxy
    vagrant ssh app
    vagrant ssh db
    ```
* **Verificar os logs da aplicação (muito útil para debug):**
    ```bash
    # Ver logs do backend e frontend juntos
    vagrant ssh app -c "pm2 logs"
    
    # Ver logs apenas do backend
    vagrant ssh app -c "pm2 logs backend"
    ```
* **Reiniciar os serviços da aplicação:**
    ```bash
    # Reiniciar apenas o backend
    vagrant ssh app -c "pm2 restart backend"

    # Reiniciar apenas o frontend
    vagrant ssh app -c "pm2 restart frontend"
    ```
* **Destruir o ambiente (apagar tudo para recomeçar do zero):**
    > **Atenção:** Este comando apaga permanentemente as máquinas virtuais.
    ```bash
    vagrant destroy -f
    ```

## Solução de Problemas (Troubleshooting)

* **Erro `EPROTO: protocol error, symlink` no Windows durante o `vagrant up`:**
    * Este projeto já foi configurado para usar o método de sincronização `rsync` para a VM `app` justamente para evitar este problema. Certifique-se de que você tem o `rsync` instalado e disponível no PATH do seu sistema (instalando o Git for Windows). Se o erro persistir, tente rodar o terminal como Administrador.

* **Erro `502 Bad Gateway` no navegador:**
    1.  Verifique se todas as 3 VMs estão com status `running` usando o comando `vagrant status`.
    2.  Acesse a VM da aplicação com `vagrant ssh app`.
    3.  Dentro da VM, verifique o status dos serviços com `pm2 list`. Ambos `backend` e `frontend` devem estar com o status `online`.
    4.  Se algum estiver `errored` ou com muitos `restarts`, verifique os logs com `pm2 logs <nome_do_processo>` para encontrar a causa do erro.
* **Pode ser que o .env não seja criado corretamente:**
    * Caso o backend não inicie, o arquivo `.env` pode não ter sido criado. Para corrigir:
    1.  Acesse a VM com `vagrant ssh app`.
    2.  Navegue até a pasta do backend: `cd /home/vagrant/app/backend`.
    3.  Copie o arquivo de exemplo: `cp .env.example .env`.
    4.  Reinicie o backend: `pm2 restart backend`.
