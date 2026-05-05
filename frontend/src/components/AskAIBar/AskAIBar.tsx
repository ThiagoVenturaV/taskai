import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { askAI } from '../../services/groqService';
import type { AiAction, ColumnId } from '../../types';
import styles from './AskAIBar.module.css';

export function AskAIBar() {
  const { tasks, addTask, updateTask, deleteTask } = useApp();
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    const prompt = value.trim();
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setFeedback('');
    setIsError(false);

    try {
      const aiResponse = await askAI(prompt, tasks);
      await executeActions(aiResponse.actions);
      setFeedback(aiResponse.message || 'Pronto!');
      setValue('');
    } catch (err) {
      console.error('[AskAI]', err);
      setIsError(true);
      setFeedback('Não foi possível processar o comando. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  async function executeActions(actions: AiAction[]) {
    for (const action of actions) {
      switch (action.type) {
        case 'create': {
          const t = action.task || {};
          await addTask({
            title: t.title || 'Nova tarefa',
            description: t.description ?? undefined,
            dueDate: t.dueDate ?? undefined,
            tag: t.tag ?? undefined,
            columnId: (t.columnId as ColumnId) || 'todo',
          });
          break;
        }

        case 'move': {
          const target = findTaskByTitle(action.targetTitle);
          if (target && action.targetColumn) {
            await updateTask(target.id, { columnId: action.targetColumn });
          }
          break;
        }

        case 'complete': {
          const target = findTaskByTitle(action.targetTitle);
          if (target) {
            await updateTask(target.id, { completed: true });
          }
          break;
        }

        case 'delete': {
          const target = findTaskByTitle(action.targetTitle);
          if (target) {
            await deleteTask(target.id);
          }
          break;
        }

        case 'update': {
          const target = findTaskByTitle(action.targetTitle);
          if (target && action.task) {
            await updateTask(target.id, { ...action.task } as any);
          }
          break;
        }

        // 'list' and 'unknown' require no state mutation
        default:
          break;
      }
    }
  }

  function findTaskByTitle(titlePattern?: string) {
    if (!titlePattern) return null;
    const lower = titlePattern.toLowerCase();
    return (
      tasks.find((t) => t.id === titlePattern) ||
      tasks.find((t) => t.title.toLowerCase() === lower) ||
      tasks.find((t) => t.title.toLowerCase().includes(lower)) ||
      null
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.bar}>
          {/* Search icon */}
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>

          <input
            ref={inputRef}
            id="ask-ai-input"
            className={styles.input}
            type="text"
            placeholder="Ask AI or search tasks..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Ask AI or search tasks"
            disabled={isLoading}
          />

          <button
            id="ask-ai-btn"
            className={styles.askBtn}
            onClick={handleSubmit}
            disabled={isLoading || !value.trim()}
            aria-label="Enviar para o agente de IA"
          >
            {isLoading && <span className={styles.spinner} aria-hidden="true" />}
            Ask AI
          </button>
        </div>
      </div>

      {feedback && (
        <p className={`${styles.feedback} ${isError ? styles.feedbackError : ''}`}>
          {feedback}
        </p>
      )}
    </div>
  );
}
