# Guia de Implantação - Aliar Cursos

## Informações de Acesso

- **Email de Administração**: aliarcursos67@gmail.com
- **Domínio**: aliar_cursos.com
- **Banco de Dados**: MySQL (aliar_cursos)
- **Usuário DB**: aliar
- **Senha DB**: aliar_cursos_2025
- **Porta**: 3000

## Configuração Realizada

### 1. Banco de Dados MySQL
O banco de dados foi criado e configurado com as seguintes características:
- Nome do banco: `aliar_cursos`
- Usuário: `aliar`
- Senha: `aliar_cursos_2025`
- Host: `localhost`
- Charset: UTF8MB4
- Collation: utf8mb4_unicode_ci

**Arquivo de configuração**: `.env`

### 2. Servidor Node.js
O servidor foi configurado para rodar em produção na porta 3000.

**Arquivo de configuração**: `.env`

### 3. Serviço Systemd (Linux)
Um serviço systemd foi criado para manter o site rodando permanentemente.

**Arquivo de serviço**: `/etc/systemd/system/aliar-cursos.service`

## Como Iniciar o Site

### Opção 1: Executar o Script Diretamente
```bash
cd /home/ubuntu/aliar-cursos
./start-server.sh
```

### Opção 2: Usar o Serviço Systemd (Recomendado)
```bash
# Iniciar o serviço
sudo systemctl start aliar-cursos.service

# Parar o serviço
sudo systemctl stop aliar-cursos.service

# Reiniciar o serviço
sudo systemctl restart aliar-cursos.service

# Ver status
sudo systemctl status aliar-cursos.service

# Ver logs
sudo journalctl -u aliar-cursos.service -f
```

### Opção 3: Iniciar em Modo Desenvolvimento
```bash
cd /home/ubuntu/aliar-cursos
pnpm dev
```

## Acessar o Site

- **URL Local**: http://localhost:3000
- **URL com Domínio**: http://aliar_cursos.com (após configurar DNS)

## Dashboard Administrativo

Acesse em: `http://localhost:3000/admin`

**Email de Admin**: aliarcursos67@gmail.com

## Configurar Domínio

Para apontar o domínio `aliar_cursos.com` para seu PC:

1. **Obtenha o IP do seu PC**:
   ```bash
   hostname -I
   ```

2. **Configure o DNS do seu registrador** para apontar para o IP do seu PC:
   - Tipo: A
   - Nome: aliar_cursos.com
   - Valor: [seu IP]

3. **Se estiver atrás de um roteador**, configure o port forwarding:
   - Porta externa: 80 (ou 443 para HTTPS)
   - Porta interna: 3000
   - IP interno: [IP do seu PC]

## Configurar HTTPS (SSL/TLS)

Para usar HTTPS, recomenda-se usar um proxy reverso como Nginx:

```bash
sudo apt-get install nginx
```

Crie um arquivo de configuração em `/etc/nginx/sites-available/aliar-cursos`:

```nginx
server {
    listen 80;
    server_name aliar_cursos.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site:
```bash
sudo ln -s /etc/nginx/sites-available/aliar-cursos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Variáveis de Ambiente

O arquivo `.env` contém as seguintes variáveis:

```
VITE_APP_ID=aliar_cursos_001
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
VITE_APP_TITLE="Aliar Cursos"
VITE_APP_LOGO="/aliar-logo.png"
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev
DATABASE_URL=mysql://aliar:aliar_cursos_2025@localhost:3306/aliar_cursos
JWT_SECRET=aliar-cursos-secret-key-2025
OPENAI_API_URL=
OPENAI_API_KEY=
PORT=3000
ADMIN_EMAIL=aliarcursos67@gmail.com
```

## Backup do Banco de Dados

Para fazer backup do banco de dados:

```bash
mysqldump -u aliar -p aliar_cursos > backup_aliar_cursos.sql
```

Para restaurar:

```bash
mysql -u aliar -p aliar_cursos < backup_aliar_cursos.sql
```

## Monitoramento

Para monitorar o site em tempo real:

```bash
# Ver logs do serviço
sudo journalctl -u aliar-cursos.service -f

# Ver processos Node.js
ps aux | grep node

# Ver uso de memória
free -h

# Ver uso de disco
df -h
```

## Troubleshooting

### Porta 3000 já está em uso
```bash
sudo lsof -i :3000
sudo kill -9 [PID]
```

### Erro de conexão com banco de dados
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Testar conexão
mysql -u aliar -p -h localhost aliar_cursos
```

### Serviço não inicia
```bash
# Ver logs detalhados
sudo journalctl -u aliar-cursos.service -n 50

# Executar o script manualmente para ver erros
bash /home/ubuntu/aliar-cursos/start-server.sh
```

## Suporte

Para dúvidas ou problemas, entre em contato:
- **Email**: aliarcursos67@gmail.com
- **WhatsApp**: https://wa.me/558535123554

---

**Última atualização**: 07 de Novembro de 2025
