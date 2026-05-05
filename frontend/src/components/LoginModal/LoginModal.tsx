import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import styles from './LoginModal.module.css';

export function LoginModal() {
  const { closeLoginModal, login, setPage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Credenciais inválidas.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function goToRegister() {
    closeLoginModal();
    setPage('register');
  }

  return (
    <Modal title="LOGIN" onClose={closeLoginModal}>
      <form id="login-form" className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-email">Login</label>
          <input
            id="login-email"
            className={styles.input}
            type="email"
            placeholder="Enter username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-password">Senha</label>
          <input
            id="login-password"
            className={styles.input}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          id="login-submit-btn"
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading || !email || !password}
        >
          {isLoading ? 'Entrando...' : 'SIGN IN'}
        </button>
      </form>

      <div className={styles.footer}>
        <button className={styles.registerLink} onClick={goToRegister} type="button">
          Criar conta nova
        </button>
      </div>
    </Modal>
  );
}
