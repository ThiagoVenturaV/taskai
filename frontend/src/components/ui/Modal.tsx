import type { ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  showBackdrop?: boolean;
}

export function Modal({ title, onClose, children, showBackdrop = true }: ModalProps) {
  return (
    <div className={styles.overlay}>
      {showBackdrop && <div className={styles.backdrop} onClick={onClose} />}
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.header}>
          <span id="modal-title" className={styles.title}>{title}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
