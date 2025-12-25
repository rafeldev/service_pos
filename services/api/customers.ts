export async function getCustomers() {
  const res = await fetch('/api/customers');
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function createCustomer(data: Record<string, unknown>) {
  const res = await fetch('/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create customer');
  return res.json();
}

export async function updateCustomer(id: number, data: Record<string, unknown>) {
  const res = await fetch(`/api/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({})) as { details?: { message?: string }; error?: string };
    const errorMessage = errorData.details?.message || errorData.error || 'Failed to update customer';
    const error = new Error(errorMessage) as Error & { details?: unknown };
    error.details = errorData.details;
    throw error;
  }
  return res.json();
}

export async function deleteCustomer(id: number) {
  const res = await fetch(`/api/customers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete customer');
  return res.json();
}