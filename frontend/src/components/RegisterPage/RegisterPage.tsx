import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './RegisterPage.module.css';


export function RegisterPage() {
  const { register, setPage, openLoginModal } = useApp();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    cpf: '',
    email: '',
    password: '',
    referral: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    setIsLoading(true);
    setError('');

    try {
      await register({
        name: form.name,
        phone: form.phone || undefined,
        cpf: form.cpf || undefined,
        email: form.email,
        password: form.password,
        referral: form.referral || undefined,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Erro ao criar conta. Tente novamente.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function goToLogin() {
    setPage('board');
    openLoginModal();
  }

  return (
    <div className={styles.page}>
      {/* Left black panel */}
      <div className={styles.leftPanel} aria-hidden="true">
        <div className={styles.logo}>
          <img src="/logoTaskAI.png" alt="Task AI" height="28" style={{ width: 'auto', filter: 'brightness(0) invert(1)' }} />
          <span className={styles.logoText}>TASK AI</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <h1 className={styles.formTitle}>Criar conta</h1>
          <p className={styles.formSubtitle}>Junte-se ao Task AI hoje.</p>

          <form id="register-form" className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-name">Nome</label>
              <input
                id="reg-name"
                name="name"
                type="text"
                className={styles.input}
                placeholder="Seu nome completo"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone + CPF */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-phone">Fone</label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  className={styles.input}
                  placeholder="(00) 00000-0000"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-cpf">CPF</label>
                <input
                  id="reg-cpf"
                  name="cpf"
                  type="text"
                  className={styles.input}
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="voce@exemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-password">Senha</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                className={styles.input}
                placeholder="Crie uma senha"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Referral (optional) */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-referral">
                Código de Indicação
                <span className={styles.optionalTag}>(Opcional)</span>
              </label>
              <input
                id="reg-referral"
                name="referral"
                type="text"
                className={`${styles.input} ${styles.inputOptional}`}
                placeholder="Ex: PROMO2024"
                value={form.referral}
                onChange={handleChange}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              id="register-submit-btn"
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || !form.name || !form.email || !form.password}
            >
              {isLoading ? 'Cadastrando...' : 'CADASTRAR →'}
            </button>
          </form>

          <div className={styles.loginLink}>
            Já tem uma conta?{' '}
            <button className={styles.loginLinkBtn} onClick={goToLogin} type="button">
              Faça login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
