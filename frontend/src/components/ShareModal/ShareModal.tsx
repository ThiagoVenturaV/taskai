import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { usersApi } from '../../services/apiClient';
import type { FriendUser } from '../../types';
import styles from './ShareModal.module.css';

export function ShareModal() {
  const { closeShareModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<FriendUser[]>([]);
  const [copied, setCopied] = useState(false);

  const boardUrl = window.location.href;

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setUsers([]); return; }
    try {
      const results = await usersApi.search(q);
      setUsers(results);
    } catch {
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, search]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(boardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  async function handleAdd(userId: string) {
    await usersApi.share(userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, added: true } : u))
    );
  }

  return (
    <Modal title="COMPARTILHAR" onClose={closeShareModal}>
      {/* URL section */}
      <div className={styles.section}>
        <p className={styles.label}>URL</p>
        <div className={styles.urlRow}>
          <span className={styles.urlText}>{boardUrl}</span>
          <button
            id="copy-url-btn"
            className={styles.copyBtn}
            onClick={handleCopy}
            aria-label="Copiar URL"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M11 5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {copied && <p className={styles.copiedMsg}>Link copiado!</p>}
      </div>

      {/* Users section */}
      <div className={styles.section}>
        <p className={styles.label}>Amigos</p>

        <div className={styles.searchRow}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" stroke="#888" strokeWidth="1.3"/>
            <path d="M10 10L13 13" stroke="#888" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            id="share-search-input"
            className={styles.searchInput}
            type="text"
            placeholder="Buscar amigos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar usuários para compartilhar"
          />
        </div>

        <ul className={styles.userList} aria-label="Lista de usuários">
          {users.map((user) => (
            <li key={user.id} className={styles.userRow}>
              <div className={styles.avatar} aria-hidden="true">{user.initials}</div>
              <span className={styles.userName}>{user.name}</span>
              <button
                id={`add-user-${user.id}`}
                className={`${styles.addBtn} ${user.added ? styles.added : ''}`}
                onClick={() => !user.added && handleAdd(user.id)}
                disabled={user.added}
                aria-label={user.added ? `${user.name} já adicionado` : `Adicionar ${user.name}`}
              >
                {user.added ? 'Adicionado' : 'Adicionar'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
