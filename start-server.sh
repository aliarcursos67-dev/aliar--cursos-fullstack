#!/bin/bash

# Script para iniciar o servidor Aliar Cursos em produção

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Iniciando Aliar Cursos - Servidor${NC}"
echo -e "${BLUE}========================================${NC}"

# Ir para o diretório do projeto
cd /home/ubuntu/aliar-cursos

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "Erro: Não foi possível encontrar o arquivo package.json"
    exit 1
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    pnpm install
fi

# Verificar se dist existe
if [ ! -d "dist" ]; then
    echo "Construindo projeto..."
    pnpm build
fi

# Iniciar o servidor
echo -e "${GREEN}Iniciando servidor em produção...${NC}"
echo "Porta: 3000"
echo "URL: http://localhost:3000"
echo ""

NODE_ENV=production node dist/index.js
