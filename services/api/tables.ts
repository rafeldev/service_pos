export async function getTables() {
  const res = await fetch('/api/tables');
  if (!res.ok) throw new Error('Failed to fetch tables');
  return res.json();
}