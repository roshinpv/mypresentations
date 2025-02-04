const API_BASE_URL = 'http://localhost:8000';

export async function getAgents() {
  const response = await fetch(`${API_BASE_URL}/agents`);
  if (!response.ok) throw new Error('Failed to fetch agents');
  return response.json();
}

export async function createAgent(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/agents`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create agent');
  return response.json();
}

export async function getAgent(id: number) {
  const response = await fetch(`${API_BASE_URL}/agents/${id}`);
  if (!response.ok) throw new Error('Failed to fetch agent');
  return response.json();
}

export async function sendMessage(agentId: number, message: string) {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
}