export async function getTables() {
  const res = await fetch('/api/tables');
  if (!res.ok) throw new Error('Failed to fetch tables');
  return res.json();
}

export async function createTable(data: any) {
  const res = await fetch('/api/tables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create table');
  return res.json();
}

export async function updateTable(id: number, data: any) {
  const res = await fetch(`/api/tables/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update table');
  return res.json();
}

export async function deleteTable(id: number) {
  const res = await fetch(`/api/tables/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete table');
  return res.json();
}