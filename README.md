# ALIAR CURSOS - Site Institucional

Site institucional da Aliar Cursos, plataforma de cursos profissionalizantes com sistema de cadastro, agendamento de aulas experimentais, feedback de alunos e centro de estágio (NAE).

## Características

- **Página Inicial**: Apresentação da instituição, cursos oferecidos e formulário de cadastro
- **Sistema de Cadastro**: Captura de leads interessados nos cursos
- **Agendamento de Aulas**: Sistema para agendar aulas experimentais
- **Feedback de Alunos**: Coleta e exibição de avaliações dos alunos
- **NAE (Núcleo de Apoio ao Estagiário)**: Centro de estágio com envio de currículos
- **Dashboard Administrativo**: Painel para gerenciar leads, agendamentos e currículos
- **Dashboard Tático**: Instruções e diretrizes para atendimento ao cliente

## Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, tRPC
- **Banco de Dados**: MySQL com Drizzle ORM
- **Build**: Vite
- **Gerenciador de Pacotes**: pnpm

## Pré-requisitos

- Node.js 22.x ou superior
- pnpm 10.x ou superior
- MySQL 8.x ou superior

## Instalação

1. Extrair o arquivo do projeto:
```bash
unzip aliar-cursos.zip
cd aliar-cursos
```

2. Instalar as dependências:
```bash
pnpm install
```

3. Configurar as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure as seguintes variáveis:
- `DATABASE_URL`: URL de conexão com o banco de dados MySQL
- `JWT_SECRET`: Chave secreta para autenticação JWT
- `VITE_APP_TITLE`: Título do aplicativo (já configurado como "Aliar Cursos")
- `VITE_APP_LOGO`: Logo do aplicativo (já configurado como "/aliar-logo.png")

4. Criar o banco de dados:
```bash
# Criar o banco de dados no MySQL
mysql -u root -p
CREATE DATABASE aliar_cursos;
exit;
```

5. Executar as migrações do banco de dados:
```bash
pnpm db:push
```

## Executar o Projeto

### Modo Desenvolvimento

```bash
pnpm dev
```

O site estará disponível em `http://localhost:3000`

### Modo Produção

1. Construir o projeto:
```bash
pnpm build
```

2. Iniciar o servidor:
```bash
pnpm start
```

## Estrutura do Projeto

```
aliar-cursos/
├── client/              # Frontend React
│   ├── public/          # Arquivos estáticos (imagens, dashboard.html)
│   └── src/             # Código-fonte do frontend
│       ├── components/  # Componentes React reutilizáveis
│       ├── pages/       # Páginas da aplicação
│       └── lib/         # Utilitários e configurações
├── server/              # Backend Node.js
│   ├── _core/           # Configurações e utilitários do servidor
│   ├── db.ts            # Funções de acesso ao banco de dados
│   ├── routers.ts       # Rotas tRPC
│   └── email.ts         # Sistema de envio de emails
├── drizzle/             # Migrações e schema do banco de dados
└── shared/              # Código compartilhado entre frontend e backend
```

## Funcionalidades Principais

### Página Inicial
- Hero section com call-to-action
- Seção "Nossa História"
- Apresentação dos cursos por área (Administrativa, Tecnológica, Outros)
- Formulário de cadastro de leads
- Botão para agendamento de aula experimental

### Dashboard Administrativo
Acesso em `/admin` (requer autenticação)
- **Aba Leads de Cadastro**: Visualização e gerenciamento de cadastros
- **Aba Aulas Agendadas**: Gerenciamento de agendamentos de aulas experimentais
- **Aba Currículos NAE**: Gerenciamento de currículos recebidos pelo centro de estágio

### NAE (Centro de Estágio)
Acesso em `/nae`
- Informações sobre o centro de estágio
- Formulário de envio de currículo com upload de arquivo
- Validação de tipo de arquivo (PDF, DOC, DOCX)
- Validação de tamanho máximo (5MB)

### Sistema de Feedback
Acesso em `/feedback`
- Formulário para avaliação de cursos
- Exibição de feedbacks aprovados
- Sistema de estrelas para avaliação

## Personalização

### Alterar Logo
Substitua o arquivo `/client/public/aliar-logo.png` pelo logo desejado.

### Alterar Cores
Edite o arquivo `/client/src/index.css` para modificar as cores do tema.

### Adicionar Novos Cursos
Edite os arquivos:
- `/client/src/pages/Home.tsx` - Seção de cursos na página inicial
- `/client/src/pages/CoursesDetail.tsx` - Detalhes dos cursos
- `/client/src/pages/ScheduleTrial.tsx` - Lista de cursos no agendamento

## Suporte

Para dúvidas ou problemas, entre em contato através do WhatsApp: https://wa.me/558535123554

## Licença

MIT License

---

© 2025 Aliar Cursos. Todos os direitos reservados.
