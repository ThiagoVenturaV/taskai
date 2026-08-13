import { useApp } from '../../context/AppContext';
import styles from './Header.module.css';


export function Header() {
  const {
    user,
    isAuthenticated,
    openLoginModal,
    openShareModal,
    logout,
  } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logoTaskAI.png" alt="Task AI" height="28" style={{ width: 'auto' }} />
        <span className={styles.logoText}>TASK AI</span>
      </div>

      <div className={styles.actions}>
        {isAuthenticated && user ? (
          <>
            <span className={styles.userGreeting}>Olá, {user.name.split(' ')[0]}</span>
            <button
              id="share-btn"
              className={styles.btnFilled}
              onClick={openShareModal}
              aria-label="Compartilhar quadro"
            >
              Compartilhar
            </button>
            <button
              id="logout-btn"
              className={styles.btnLogout}
              onClick={logout}
              aria-label="Sair"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <button
              id="login-btn"
              className={styles.btnOutlined}
              onClick={openLoginModal}
              aria-label="Fazer login"
            >
              Entrar
            </button>
            <button
              id="share-btn"
              className={styles.btnFilled}
              onClick={openShareModal}
              aria-label="Compartilhar quadro"
            >
              Compartilhar
            </button>
          </>
        )}
      </div>
    </header>
  );
}
