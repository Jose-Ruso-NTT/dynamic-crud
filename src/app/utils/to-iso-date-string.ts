export function toISODateString(v?: string | Date): string | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string') return v; // asume 'YYYY-MM-DD' si ya viene string
  const yyyy = v.getFullYear();
  const mm = String(v.getMonth() + 1).padStart(2, '0');
  const dd = String(v.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}
