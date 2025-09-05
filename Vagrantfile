# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  #configura um timeout pras vms (é normal dar timeout quando tem que baixar bastante coisa)
  config.vm.boot_timeout = 1800
  # 1. Máquina Virtual do Banco de Dados (MySQL)
  config.vm.define "bd" do |bd|
    bd.vm.box = "bento/ubuntu-22.04"
    bd.vm.hostname = "db"
    bd.vm.network "private_network", ip: "10.0.0.30", virtualbox__intnet: "lan_app"
    bd.vm.provision "shell", path: "provision-db.sh"

    bd.vm.provider "virtualbox" do |vb|
      vb.name = "Lanchonete-DB"
    end
  end

  # 2. Máquina Virtual da Aplicação (Node.js + React)
  config.vm.define "app" do |app|
    app.vm.box = "bento/ubuntu-22.04"
    app.vm.hostname = "app"
    app.vm.network "private_network", ip: "10.0.0.20", virtualbox__intnet: "lan_app"
    app.vm.synced_folder ".", "/home/vagrant/app", type: "rsync",
      rsync__exclude: [".vagrant/",".git","node_modules/","backend/.env.example","backend/.env","frontend/.env","frontend/.env.example"]
    app.vm.provision "shell", path: "provision-app.sh"

    app.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.name = "Lanchonete-App"
    end
  end

  # 3. Máquina Virtual do Proxy Reverso (Nginx) 
  config.vm.define "proxy" do |proxy|
    proxy.vm.box = "bento/ubuntu-22.04"
    proxy.vm.hostname = "proxy"
    proxy.vm.network "forwarded_port", guest: 80, host: 8080
    proxy.vm.network "private_network", ip: "10.0.0.10", virtualbox__intnet: "lan_app"
    proxy.vm.synced_folder "./nginx", "/vagrant_nginx"
    proxy.vm.provision "shell", path: "provision-proxy.sh"

    proxy.vm.provider "virtualbox" do |vb|
      vb.name = "Lanchonete-Proxy"
    end
  end

end