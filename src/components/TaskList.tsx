import { TaskItem } from './TaskItem';
import type { Task, UpdateTaskInput } from '../types/task';
import '../styles/components.css';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (taskId: string, updates: UpdateTaskInput) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay tareas. ¡Crea una nueva para comenzar!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
