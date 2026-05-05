import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { KanbanColumn } from '../KanbanColumn/KanbanColumn';
import { COLUMNS } from '../../constants';
import type { ColumnId } from '../../types';
import styles from './KanbanBoard.module.css';

export function KanbanBoard() {
  const { tasks, reorderTasks, isAuthenticated } = useApp();
  const draggedTaskId = useRef<string | null>(null);

  function handleDragStart(_e: React.DragEvent, taskId: string) {
    draggedTaskId.current = taskId;
  }

  async function handleDrop(_e: React.DragEvent, targetColumnId: ColumnId) {
    const taskId = draggedTaskId.current;
    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.columnId === targetColumnId) {
      draggedTaskId.current = null;
      return;
    }

    // Place dropped task at end of target column
    const tasksInTarget = tasks
      .filter((t) => t.columnId === targetColumnId)
      .sort((a, b) => a.position - b.position);

    const newPosition = tasksInTarget.length;

    await reorderTasks([{ id: taskId, columnId: targetColumnId, position: newPosition }]);
    draggedTaskId.current = null;
  }

  return (
    <main className={styles.board} aria-label="Quadro Kanban">
      {COLUMNS.map((column) => {
        const columnTasks = tasks
          .filter((t) => t.columnId === column.id)
          .sort((a, b) => a.position - b.position);

        return (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={columnTasks}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        );
      })}

      {!isAuthenticated && tasks.length === 0 && (
        <div className={styles.emptyState}>
          <p>Faça login para começar a gerenciar suas tarefas.</p>
          <p className={styles.emptyStateHint}>
            Ou use o campo "Ask AI" acima para criar tarefas sem login.
          </p>
        </div>
      )}
    </main>
  );
}
