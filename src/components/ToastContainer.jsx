export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast${t.type === 'badge' ? ' badge-toast' : t.type === 'xp' ? ' xp-toast' : t.type === 'undo' ? ' undo-toast' : ''}`}
        >
          <span className="toast-message">{t.message}</span>
          {t.actionLabel && (t.onUndo || t.onAction) && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                (t.onUndo || t.onAction)();
                onDismiss(t.id);
              }}
            >
              {t.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
