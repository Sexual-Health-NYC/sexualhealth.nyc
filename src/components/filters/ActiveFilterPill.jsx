export default function ActiveFilterPill({ category, value, label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 py-1 px-3 bg-surface hover:bg-primary/10 text-primary border-[1.5px] border-primary rounded-full text-sm font-medium transition-colors">
      {label}
      <button
        onClick={() => onRemove(category, value)}
        aria-label={`Remove ${label} filter`}
        className="bg-transparent border-none text-primary cursor-pointer text-lg p-2 min-w-[20px] min-h-[20px] flex items-center justify-center rounded-sm focus-ring -me-1"
      >
        ×
      </button>
    </span>
  );
}
