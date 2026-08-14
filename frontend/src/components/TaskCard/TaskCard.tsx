import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { uploadApi } from '../../services/apiClient';
import { Checkbox } from '../ui/Checkbox';
import type { Task } from '../../types';
import styles from './TaskCard.module.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  const { updateTask, deleteTask } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDragStart(e: React.DragEvent) {
    setIsDragging(true);
    onDragStart(e, task.id);
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  async function handleToggleComplete() {
    await updateTask(task.id, { completed: !task.completed });
  }

  async function handleDelete() {
    if (window.confirm(`Deletar "${task.title}"?`)) {
      await deleteTask(task.id);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type) || file.size > 2 * 1024 * 1024) {
      alert('Use uma imagem JPEG, PNG, GIF ou WebP de até 2MB.');
      e.target.value = '';
      return;
    }
    setIsUploading(true);
    try {
      const { imageUrl } = await uploadApi.uploadImage(file, task.id);
      await updateTask(task.id, { imageUrl });
    } catch {
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const imageFullUrl = task.imageUrl
    ? task.imageUrl.startsWith('http') || task.imageUrl.startsWith('data:image/')
      ? task.imageUrl
      : `${API_BASE}${task.imageUrl}`
    : null;

  const formattedDue = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <article
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      aria-label={`Tarefa: ${task.title}`}
    >
      <div className={styles.row}>
        <Checkbox
          checked={task.completed}
          onChange={handleToggleComplete}
          label={`Marcar "${task.title}" como ${task.completed ? 'pendente' : 'concluída'}`}
        />
        <div className={styles.content}>
          <p className={`${styles.title} ${task.completed ? styles.completed : ''}`}>
            {task.title}
          </p>

          {formattedDue && (
            <p className={styles.dueDate}>Vence em {formattedDue}</p>
          )}

          {task.tag && <span className={styles.tag}>{task.tag}</span>}

          {imageFullUrl && (
            <img
              src={imageFullUrl}
              alt={`Imagem da tarefa ${task.title}`}
              className={styles.image}
            />
          )}
        </div>
      </div>

      {/* Hover actions */}
      <div className={styles.actions}>
        <label className={styles.uploadLabel} title={isUploading ? 'Enviando...' : 'Anexar imagem'}>
          {isUploading ? '...' : '📎 Imagem'}
          <input
            ref={fileInputRef}
            type="file"
            className={styles.uploadInput}
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            aria-label="Upload de imagem para a tarefa"
          />
        </label>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
          onClick={handleDelete}
          aria-label={`Deletar tarefa ${task.title}`}
        >
          Deletar
        </button>
      </div>
    </article>
  );
}
