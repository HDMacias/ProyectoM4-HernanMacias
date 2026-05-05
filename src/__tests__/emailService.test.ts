import { describe, it, expect } from 'vitest';
import { calculateTaskSummary } from '../services/emailService';
import type { Task } from '../types/task';

describe('emailService', () => {
  describe('calculateTaskSummary', () => {
    it('debería calcular correctamente el resumen de tareas vacío', async () => {
      const summary = await calculateTaskSummary([]);
      expect(summary).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
      });
    });

    it('debería calcular el resumen con tareas completadas y pendientes', async () => {
      const tasks: Task[] = [
        {
          id: '1',
          userId: 'user1',
          title: 'Tarea 1',
          description: 'Descripción 1',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          title: 'Tarea 2',
          description: 'Descripción 2',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          userId: 'user1',
          title: 'Tarea 3',
          description: 'Descripción 3',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const summary = await calculateTaskSummary(tasks);
      expect(summary).toEqual({
        total: 3,
        completed: 2,
        pending: 1,
      });
    });

    it('debería calcular correctamente cuando todas las tareas están completadas', async () => {
      const tasks: Task[] = [
        {
          id: '1',
          userId: 'user1',
          title: 'Tarea 1',
          description: 'Descripción 1',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          title: 'Tarea 2',
          description: 'Descripción 2',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const summary = await calculateTaskSummary(tasks);
      expect(summary).toEqual({
        total: 2,
        completed: 2,
        pending: 0,
      });
    });
  });
});
