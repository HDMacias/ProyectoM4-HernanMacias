import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { EmailSummaryButton } from '../components/EmailSummaryButton';
import type { CreateTaskInput } from '../types/task';
import '../styles/tasks.css';

export function Tasks() {
  const { user, logout } = useAuth();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const handleCreateTask = async (taskInput: CreateTaskInput) => {
    await createTask(taskInput);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="tasks-container">
      <header className="tasks-header">
        <h1>Mis Tareas</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="tasks-main">
        <TaskForm onSubmit={handleCreateTask} />

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Todas ({tasks.length})
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pendientes ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completadas ({tasks.filter((t) => t.completed).length})
          </button>
        </div>

        <EmailSummaryButton
          tasks={tasks}
          userEmail={user?.email || undefined}
          userName={user?.email?.split('@')[0] || 'Usuario'}
        />

        {loading ? (
          <div className="loading">Cargando tareas...</div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        )}
      </main>
    </div>
  );
}
