# ALIAR CURSOS - Dashboard Tático - TODO

## Funcionalidades Implementadas

### Página NAE (Centro de Estágio)
- [x] Página NAE com hero section
- [x] Informações sobre o NAE
- [x] Formulário de envio de currículo
- [x] Validação de campos obrigatórios
- [x] Upload de arquivo com drag & drop
- [x] Validação de tipo de arquivo (PDF, DOC, DOCX)
- [x] Validação de tamanho máximo (5MB)
- [x] Mensagem de sucesso após envio

### Dashboard Administrativo
- [x] Aba "Leads de Cadastro" (existente)
- [x] Aba "Aulas Agendadas" (existente)
- [x] Aba "Currículos NAE" (nova)

### Aba "Currículos NAE" no Dashboard
- [x] Exibição de lista de currículos recebidos
- [x] Filtro por área (Administrativa, Comercial, Tecnológica, Idioma)
- [x] Contagem dinâmica de currículos por filtro
- [x] Painel de detalhes com informações completas
- [x] Dropdown para mudar status do currículo
- [x] Campo de notas para adicionar observações
- [x] Botão "Salvar Notas" para atualizar observações
- [x] Botão "Deletar" para remover currículos
- [x] Botão "Fechar" para fechar painel de detalhes

### Backend (Rotas TRPC)
- [x] Rota create para criar novo currículo
- [x] Rota list para listar todos os currículos
- [x] Rota listByArea para filtrar por área
- [x] Rota getById para obter currículo específico
- [x] Rota update para atualizar status e notas
- [x] Rota delete para deletar currículo

### Banco de Dados
- [x] Tabela "curriculos" criada
- [x] Campos: id, nome, email, telefone, área, arquivo, status, notas, timestamps
- [x] Função createCurriculo() implementada
- [x] Função getAllCurriculos() implementada
- [x] Função getCurriculosByArea() implementada
- [x] Função getCurriculoById() implementada
- [x] Função updateCurriculo() implementada
- [x] Função deleteCurriculo() implementada

## Testes Realizados
- [x] Formulário NAE - Envio de currículo com sucesso
- [x] Dashboard - Aba "Currículos NAE" exibindo currículo recebido
- [x] Status - Mudança de status de "Recebido" para "Analisando" funcionando
- [x] Filtro - Filtro por área funcionando corretamente
- [x] Painel de Detalhes - Exibição de informações completas funcionando

### Navbar da Página Inicial
- [x] Botão "Cadastro" repositionado para ficar ao lado de "Cursos"

## Próximos Passos (Opcional)
- [ ] Implementar download de arquivo do currículo
- [ ] Implementar envio de email para candidato após mudança de status
- [ ] Implementar relatório de currículos por área
- [ ] Implementar busca por nome/email de candidato

