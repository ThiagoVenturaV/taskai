import type { Column } from '../types';

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'A fazer' },
  { id: 'in-progress', title: 'Em andamento' },
  { id: 'review', title: 'Revisão' },
  { id: 'done', title: 'Concluído' },
];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
