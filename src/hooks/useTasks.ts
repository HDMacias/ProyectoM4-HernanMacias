import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../features/AuthContext';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a cambios en tiempo real
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedTasks: Task[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loadedTasks.push({
            id: doc.id,
            userId: data.userId,
            title: data.title,
            description: data.description,
            completed: data.completed,
            priority: data.priority,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            dueDate: data.dueDate?.toDate(),
          });
        });
        setTasks(loadedTasks);
        setLoading(false);
      },
      (err) => {
        console.error('Error cargando tareas:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const createTask = async (taskInput: CreateTaskInput) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        title: taskInput.title,
        description: taskInput.description,
        completed: false,
        priority: taskInput.priority || 'medium',
        dueDate: taskInput.dueDate ? Timestamp.fromDate(taskInput.dueDate) : null,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creando tarea';
      setError(message);
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: UpdateTaskInput) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const taskRef = doc(db, 'tasks', taskId);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.dueDate) {
        updateData.dueDate = Timestamp.fromDate(updates.dueDate);
      }

      await updateDoc(taskRef, updateData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error actualizando tarea';
      setError(message);
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error eliminando tarea';
      setError(message);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}
