"use client";

import styles from "./ToastStack.module.css";

export type Toast = { id: number; message: string };

export function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className={styles.stack} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={styles.toast}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
