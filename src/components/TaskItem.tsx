import { useState } from 'react';
import type { Task, UpdateTaskInput } from '../types/task';
import '../styles/components.css';

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: UpdateTaskInput) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await onUpdate(task.id, { completed: !task.completed });
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      await onUpdate(task.id, {
        title,
        description,
        priority: priority as 'low' | 'medium' | 'high',
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error al guardar cambios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      setLoading(true);
      try {
        await onDelete(task.id);
      } catch (err) {
        console.error('Error al eliminar tarea:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high':
        return '#ff6b6b';
      case 'medium':
        return '#ffd93d';
      case 'low':
        return '#6bcf7f';
      default:
        return '#999';
    }
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="edit-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="edit-textarea"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="edit-select"
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
        <div className="edit-actions">
          <button
            onClick={handleSaveEdit}
            disabled={loading}
            className="save-btn"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="cancel-btn"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggleComplete}
        disabled={loading}
        className="task-checkbox"
      />
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <div className="task-meta">
          <span
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(priority) }}
          >
            {priority}
          </span>
          <span className="task-date">
            {new Date(task.createdAt).toLocaleDateString('es-AR')}
          </span>
        </div>
      </div>
      <div className="task-actions">
        <button
          onClick={() => setIsEditing(true)}
          disabled={loading}
          className="edit-btn"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="delete-btn"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
