export function Loading() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      <p className="text-sm" style={{ color: "#64748b" }}>
        Carregando...
      </p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="min-h-screen p-6 md:p-8">
      <p className="text-lg font-medium" style={{ color: "#ef4444" }}>
        {message}
      </p>
      {onRetry && (
        <button className="chip mt-4" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
