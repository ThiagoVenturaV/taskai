// ─── Domain Types ─────────────────────────────────────────────────────────────

export type ColumnId = 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  tag?: string | null;
  imageUrl?: string | null;
  columnId: ColumnId;
  completed: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FriendUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  added: boolean;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  phone?: string;
  cpf?: string;
  email: string;
  password: string;
  referral?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── AI Types ─────────────────────────────────────────────────────────────────

export type AiActionType = 'create' | 'move' | 'delete' | 'update' | 'list' | 'complete' | 'unknown';

export interface AiAction {
  type: AiActionType;
  /** For create/update: task fields */
  task?: Partial<Task> & { title?: string };
  /** For move/delete/complete: task id or title pattern */
  targetId?: string;
  targetTitle?: string;
  /** For move: destination column */
  targetColumn?: ColumnId;
  /** Human-readable message to display in the UI */
  message: string;
}

export interface AiResponse {
  actions: AiAction[];
  message: string;
}
