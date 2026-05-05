import { Task } from '../types/task';

interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
}

export async function calculateTaskSummary(tasks: Task[]): Promise<TaskSummary> {
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };
}

export async function sendTaskSummaryEmail(
  email: string,
  tasks: Task[],
  userName: string
): Promise<{ success: boolean; message: string }> {
  try {
    const summary = await calculateTaskSummary(tasks);

    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        taskSummary: summary,
        userName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al enviar email');
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Email enviado exitosamente',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error enviando email:', message);
    return {
      success: false,
      message,
    };
  }
}
