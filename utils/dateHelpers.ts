export function formatDisplayDate(date: Date | string) {
  const value = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(value);
}

export function formatDisplayTime(date: Date | string) {
  const value = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value);
}

export function getIsoTimestamp(date = new Date()) {
  return date.toISOString();
}
