import { executeAsync, queryAllAsync } from '@/lib/db';
import { NewProject, Project } from '@/types/entities';

export async function listProjects(): Promise<Project[]> {
  return queryAllAsync<Project>('SELECT * FROM projects ORDER BY createdAt DESC');
}

export async function createProject(input: NewProject): Promise<void> {
  const createdAt = Date.now();
  await executeAsync(
    'INSERT INTO projects (name, description, status, createdAt) VALUES (?, ?, ?, ?)',
    [input.name, input.description ?? null, input.status ?? null, createdAt]
  );
}

export async function updateProject(id: number, input: Partial<NewProject>): Promise<void> {
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
  await executeAsync(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteProject(id: number): Promise<void> {
  await executeAsync('DELETE FROM projects WHERE id = ?', [id]);
}