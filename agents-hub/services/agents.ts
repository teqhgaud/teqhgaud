import { executeAsync, queryAllAsync } from '@/lib/db';
import { Agent, NewAgent } from '@/types/entities';

export async function listAgents(): Promise<Agent[]> {
  return queryAllAsync<Agent>('SELECT * FROM agents ORDER BY createdAt DESC');
}

export async function createAgent(input: NewAgent): Promise<void> {
  const createdAt = Date.now();
  await executeAsync(
    'INSERT INTO agents (name, description, status, createdAt) VALUES (?, ?, ?, ?)',
    [input.name, input.description ?? null, input.status ?? null, createdAt]
  );
}

export async function updateAgent(id: number, input: Partial<NewAgent>): Promise<void> {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];
  if (input.name !== undefined) {
    fields.push('name = ?');
    values.push(input.name);
  }
  if (input.description !== undefined) {
    fields.push('description = ?');
    values.push(input.description ?? null);
  }
  if (input.status !== undefined) {
    fields.push('status = ?');
    values.push(input.status ?? null);
  }
  if (!fields.length) return;
  values.push(id);
  await executeAsync(`UPDATE agents SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteAgent(id: number): Promise<void> {
  await executeAsync('DELETE FROM agents WHERE id = ?', [id]);
}