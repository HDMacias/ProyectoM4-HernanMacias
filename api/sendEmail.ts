import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, taskSummary, userName } = req.body;

  if (!email || !taskSummary) {
    return res.status(400).json({ error: 'Email y resumen de tareas son requeridos' });
  }

  const summary = taskSummary as TaskSummary;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
          .header h1 { margin: 0; }
          .content { margin: 20px 0; }
          .stat { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #667eea; }
          .stat strong { color: #667eea; }
          .footer { color: #999; font-size: 12px; margin-top: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Resumen de Tus Tareas</h1>
          </div>
          
          <div class="content">
            <p>Hola ${userName || 'usuario'},</p>
            <p>Aquí está tu resumen de tareas:</p>
            
            <div class="stat">
              <strong>Total de tareas:</strong> ${summary.total}
            </div>
            
            <div class="stat">
              <strong>Completadas:</strong> ${summary.completed}
            </div>
            
            <div class="stat">
              <strong>Pendientes:</strong> ${summary.pending}
            </div>

            <p style="margin-top: 20px;">
              Porcentaje completado: <strong>${summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0}%</strong>
            </p>

            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Este es un email automático. No responda a este mensaje.
            </p>
          </div>

          <div class="footer">
            <p>&copy; 2024 Task Manager. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Resumen de Tus Tareas
=====================

Hola ${userName || 'usuario'},

Total de tareas: ${summary.total}
Completadas: ${summary.completed}
Pendientes: ${summary.pending}
Porcentaje completado: ${summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0}%

Este es un email automático. No responda a este mensaje.
  `;

  try {
    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL || 'noreply@taskmanager.com',
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: '📋 Resumen de Tus Tareas',
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textContent,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const response = await sesClient.send(command);

    return res.status(200).json({
      success: true,
      message: 'Email enviado exitosamente',
      messageId: response.MessageId,
    });
  } catch (error) {
    console.error('Error al enviar email:', error);

    return res.status(500).json({
      success: false,
      error: 'Error al enviar email',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}
