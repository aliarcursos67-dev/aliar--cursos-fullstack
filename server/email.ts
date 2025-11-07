import { ENV } from './_core/env';

interface EmailData {
  nome: string;
  email: string;
  telefone: string;
  area?: string;
}

/**
 * Enviar email de notificação quando um novo lead é criado
 * Usa a API de notificações integrada da plataforma
 */
export async function sendNewLeadNotification(lead: EmailData) {
  try {
    // Usar a API de notificações integrada da plataforma
    const response = await fetch(process.env.VITE_ANALYTICS_ENDPOINT || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
      },
      body: JSON.stringify({
        type: 'new_lead',
        data: {
          nome: lead.nome,
          email: lead.email,
          telefone: lead.telefone,
          area: lead.area || 'Não especificada',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      console.error('[Email] Erro ao enviar notificação:', response.statusText);
    }
  } catch (error) {
    console.error('[Email] Erro ao enviar notificação:', error);
    // Não lançar erro para não interromper o cadastro
  }
}

/**
 * Enviar email HTML formatado com os detalhes do cadastro
 */
export function generateLeadEmailHTML(lead: EmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
          }
          .content h2 {
            color: #1e3a8a;
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 20px;
          }
          .lead-info {
            background-color: #f0f7ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e7ff;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #1e3a8a;
            min-width: 120px;
          }
          .info-value {
            color: #555;
            word-break: break-word;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e5e7eb;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Novo Cadastro Recebido!</h1>
            <p>Aliar Cursos - Sistema de Notificações</p>
          </div>
          
          <div class="content">
            <h2>Detalhes do Cadastro</h2>
            
            <div class="lead-info">
              <div class="info-row">
                <span class="info-label">Nome:</span>
                <span class="info-value">${lead.nome}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${lead.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Telefone:</span>
                <span class="info-value">${lead.telefone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Área:</span>
                <span class="info-value">${lead.area || 'Não especificada'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Data:</span>
                <span class="info-value">${new Date().toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <p style="color: #666; margin-top: 20px;">
              Um novo visitante se cadastrou no site da Aliar Cursos. 
              Acesse o <strong>Dashboard Administrativo</strong> para gerenciar este e outros cadastros.
            </p>

            <a href="${process.env.VITE_APP_ID || 'https://aliar-cursos.com'}/admin" class="button">
              Ir para Dashboard
            </a>
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Aliar Cursos. Todos os direitos reservados.</p>
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

