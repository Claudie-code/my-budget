const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export const incomesApi = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/api/incomes`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch incomes');
    return res.json();
  },

  create: async (data: { description: string; amount: number }) => {
    const res = await fetch(`${API_URL}/api/incomes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create income');
    return res.json();
  },

  delete: async (id: number) => {
    const res = await fetch(`${API_URL}/api/incomes/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete income');
  },
};
