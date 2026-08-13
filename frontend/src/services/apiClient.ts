import axios from 'axios';
import { API_BASE_URL } from '../constants';
import type {
  AuthResponse,
  RegisterPayload,
  LoginPayload,
  Task,
  ColumnId,
  FriendUser,
  AiResponse,
} from '../types';

// ─── Axios Instance ───────────────────────────────────────────────────────────

export const api = axios.create({ baseURL: API_BASE_URL });

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    api.post<AuthResponse>('/auth/register', payload).then((r) => r.data),

  login: (payload: LoginPayload): Promise<AuthResponse> =>
    api.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

  me: (): Promise<{ user: AuthResponse['user'] }> =>
    api.get<{ user: AuthResponse['user'] }>('/auth/me').then((r) => r.data),
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const tasksApi = {
  list: (): Promise<Task[]> => api.get<Task[]>('/tasks').then((r) => r.data),

  create: (payload: {
    title: string;
    description?: string;
    dueDate?: string;
    tag?: string;
    columnId?: ColumnId;
  }): Promise<Task> => api.post<Task>('/tasks', payload).then((r) => r.data),

  update: (
    id: string,
    payload: Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'tag' | 'columnId' | 'completed' | 'position' | 'imageUrl'>>
  ): Promise<Task> => api.patch<Task>(`/tasks/${id}`, payload).then((r) => r.data),

  delete: (id: string): Promise<void> => api.delete(`/tasks/${id}`).then(() => undefined),

  reorder: (
    tasks: Array<{ id: string; columnId: ColumnId; position: number }>
  ): Promise<void> =>
    api.post('/tasks/reorder', { tasks }).then(() => undefined),
};

// ─── Upload ───────────────────────────────────────────────────────────────────

export const uploadApi = {
  uploadImage: (file: File, taskId?: string): Promise<{ imageUrl: string }> => {
    const form = new FormData();
    form.append('image', file);
    if (taskId) form.append('taskId', taskId);
    return api
      .post<{ imageUrl: string }>('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};

export const aiApi = {
  ask: (prompt: string): Promise<AiResponse> =>
    api.post<AiResponse>('/ai', { prompt }).then((r) => r.data),
};

// ─── Users / Share ────────────────────────────────────────────────────────────

export const usersApi = {
  search: (q: string): Promise<FriendUser[]> =>
    api.get<FriendUser[]>('/users/search', { params: { q } }).then((r) => r.data),

  share: (sharedWithId: string): Promise<void> =>
    api.post('/users/share', { sharedWithId }).then(() => undefined),
};
