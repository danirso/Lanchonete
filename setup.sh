#!/bin/bash

# === Configuração ===
APP_VMS=("app" "bd")   # coloque aqui os nomes exatos das VMs de aplicação
PROXY_VM="proxy"             # nome da VM do proxy (continua com NAT)

# === 1. Sobe todas as VMs com provisionamento ===
echo ">>> Subindo todas as VMs com provisionamento..."
vagrant up --provision

# === 2. Remove NAT das VMs de aplicação ===
for VM in "${APP_VMS[@]}"; do
  echo ">>> Removendo NAT da VM: $VM"
  VBoxManage modifyvm "$VM" --nic1 none
  VBoxManage modifyvm "$VM" --nic2 hostonly --hostonlyadapter2 vboxnet0
done

echo ">>> NAT removido das VMs de aplicação. Proxy continua com NAT."
