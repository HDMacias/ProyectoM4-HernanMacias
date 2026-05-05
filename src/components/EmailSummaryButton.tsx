import { useState } from 'react';
import { sendTaskSummaryEmail } from '../services/emailService';
import type { Task } from '../types/task';
import '../styles/components.css';

interface EmailSummaryButtonProps {
  tasks: Task[];
  userEmail?: string;
  userName?: string;
}

export function EmailSummaryButton({ tasks, userEmail, userName }: EmailSummaryButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSendEmail = async () => {
    if (!userEmail || !userName) {
      setMessage({ type: 'error', text: 'Email o nombre no disponible' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await sendTaskSummaryEmail(userEmail, tasks, userName);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al enviar el email. Por favor intenta más tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-summary-section">
      <button
        onClick={handleSendEmail}
        disabled={loading || tasks.length === 0}
        className="email-summary-btn"
      >
        {loading ? '📧 Enviando...' : '📧 Enviar Resumen por Email'}
      </button>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
