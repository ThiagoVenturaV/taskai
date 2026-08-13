import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Task, User, ColumnId } from '../types';
import { authApi, tasksApi } from '../services/apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

  // Tasks
  tasks: Task[];
  isTasksLoading: boolean;

  // Modal visibility
  isLoginModalOpen: boolean;
  isShareModalOpen: boolean;

  // Page
  page: 'board' | 'register';
}

interface AppActions {
  // Auth
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    phone?: string;
    cpf?: string;
    email: string;
    password: string;
    referral?: string;
  }) => Promise<void>;
  logout: () => void;

  // Tasks — optimistic updates backed by API
  addTask: (payload: {
    title: string;
    description?: string;
    dueDate?: string;
    tag?: string;
    columnId?: ColumnId;
  }) => Promise<Task>;
  updateTask: (id: string, fields: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (tasks: Array<{ id: string; columnId: ColumnId; position: number }>) => Promise<void>;
  refreshTasks: () => Promise<void>;

  // Modals
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openShareModal: () => void;
  closeShareModal: () => void;

  // Page
  setPage: (page: AppState['page']) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<(AppState & AppActions) | null>(null);

// This module intentionally exports the provider and its matching hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState & AppActions {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasStoredToken] = useState(() => Boolean(localStorage.getItem('taskai_token')));
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(hasStoredToken);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [page, setPage] = useState<AppState['page']>('board');

  // ── Bootstrap auth from stored token ──────────────────────────────────────
  useEffect(() => {
    if (!hasStoredToken) return;

    authApi.me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('taskai_token'))
      .finally(() => setIsAuthLoading(false));
  }, [hasStoredToken]);

  // ── Load tasks when authenticated ─────────────────────────────────────────
  const refreshTasks = useCallback(async () => {
    if (!user) return;
    setIsTasksLoading(true);
    try {
      const data = await tasksApi.list();
      setTasks(data);
    } finally {
      setIsTasksLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void refreshTasks(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [refreshTasks]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await authApi.login({ email, password });
    localStorage.setItem('taskai_token', token);
    setUser(user);
    setIsLoginModalOpen(false);
  }, []);

  const register = async (payload: Parameters<typeof authApi.register>[0]) => {
    const { token, user } = await authApi.register(payload);
    localStorage.setItem('taskai_token', token);
    setUser(user);
    setPage('board');
  };

  const logout = useCallback(() => {
    localStorage.removeItem('taskai_token');
    setUser(null);
    setTasks([]);
  }, []);

  // ── Task actions ──────────────────────────────────────────────────────────
  const addTask = useCallback(async (payload: Parameters<typeof tasksApi.create>[0]) => {
    const task = await tasksApi.create(payload);
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback(async (id: string, fields: Partial<Task>) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...fields } : t)));
    try {
      const updated = await tasksApi.update(id, fields);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      // Rollback on error
      await refreshTasks();
    }
  }, [refreshTasks]);

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await tasksApi.delete(id);
    } catch {
      await refreshTasks();
    }
  }, [refreshTasks]);

  const reorderTasks = useCallback(async (reorderPayload: Array<{ id: string; columnId: ColumnId; position: number }>) => {
    // Apply optimistic position changes
    setTasks((prev) => {
      const map = new Map(reorderPayload.map((r) => [r.id, r]));
      return prev.map((t) => {
        const r = map.get(t.id);
        return r ? { ...t, columnId: r.columnId, position: r.position } : t;
      });
    });
    await tasksApi.reorder(reorderPayload);
  }, []);

  return (
    <AppContext.Provider
      value={{
        // State
        user,
        isAuthenticated: !!user,
        isAuthLoading,
        tasks,
        isTasksLoading,
        isLoginModalOpen,
        isShareModalOpen,
        page,

        // Actions
        login,
        register,
        logout,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        refreshTasks,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        openShareModal: () => setIsShareModalOpen(true),
        closeShareModal: () => setIsShareModalOpen(false),
        setPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
