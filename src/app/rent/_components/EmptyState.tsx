import styles from "./EmptyState.module.css";

export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className={styles.empty}>
      <h3>No matching results</h3>
      <p>Try changing your search, such as removing filters or zooming out.</p>
      <button type="button" onClick={onClear}>
        Remove all filters
      </button>
    </div>
  );
}
