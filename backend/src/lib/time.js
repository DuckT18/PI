// Formato de tempo relativo usado pelo frontend ("2 min atrás").
export function timeAgo(date, now = new Date()) {
  const min = Math.floor((now - date) / 60_000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min} min atrás`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} h atrás`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 dia atrás' : `${days} dias atrás`;
}
