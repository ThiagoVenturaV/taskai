import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskCard } from '../TaskCard/TaskCard';
import type { Column, Task, ColumnId } from '../../types';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent, columnId: ColumnId) => void;
}

export function KanbanColumn({ column, tasks, onDragStart, onDrop }: KanbanColumnProps) {
  const { addTask, isAuthenticated } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    setIsDragOver(false);
    onDrop(e, column.id);
  }

  async function handleAddTask() {
    const title = newTitle.trim();
    if (!title) return;
    await addTask({ title, columnId: column.id });
    setNewTitle('');
    setIsAdding(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAddTask();
    if (e.key === 'Escape') { setIsAdding(false); setNewTitle(''); }
  }

  return (
    <section
      className={`${styles.column} ${isDragOver ? styles.dragOver : ''}`}
      aria-label={`Coluna: ${column.title}`}
    >
      {/* Column header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{column.title}</h2>
        <span className={styles.count}>{tasks.length}</span>
      </div>

      {/* Task list — drop zone */}
      <div
        className={styles.taskList}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="list"
        aria-label={`Tarefas em ${column.title}`}
      >
        {tasks.map((task) => (
          <div key={task.id} role="listitem">
            <TaskCard task={task} onDragStart={onDragStart} />
          </div>
        ))}
      </div>

      {/* Quick-add */}
      {isAuthenticated && (
        isAdding ? (
          <div className={styles.addForm}>
            <input
              className={styles.addInput}
              type="text"
              placeholder="Título da tarefa..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              aria-label="Título da nova tarefa"
            />
            <div className={styles.addActions}>
              <button
                className={styles.addSubmit}
                onClick={handleAddTask}
                disabled={!newTitle.trim()}
                aria-label="Adicionar tarefa"
              >
                Adicionar
              </button>
              <button
                className={styles.addCancel}
                onClick={() => { setIsAdding(false); setNewTitle(''); }}
                aria-label="Cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            id={`add-task-${column.id}`}
            className={styles.addBtn}
            onClick={() => setIsAdding(true)}
            aria-label={`Adicionar tarefa em ${column.title}`}
          >
            + Adicionar tarefa
          </button>
        )
      )}
    </section>
  );
}
