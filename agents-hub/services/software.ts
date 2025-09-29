import { executeAsync, queryAllAsync } from '@/lib/db';
import { NewSoftware, Software } from '@/types/entities';

export async function listSoftware(): Promise<Software[]> {
  return queryAllAsync<Software>('SELECT * FROM software ORDER BY createdAt DESC');
}

export async function createSoftware(input: NewSoftware): Promise<void> {
  const createdAt = Date.now();
  await executeAsync(
    'INSERT INTO software (name, description, repoUrl, createdAt) VALUES (?, ?, ?, ?)',
    [input.name, input.description ?? null, input.repoUrl ?? null, createdAt]
  );
}

export async function updateSoftware(id: number, input: Partial<NewSoftware>): Promise<void> {
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
  if (input.repoUrl !== undefined) {
    fields.push('repoUrl = ?');
    values.push(input.repoUrl ?? null);
  }
  if (!fields.length) return;
  values.push(id);
  await executeAsync(`UPDATE software SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteSoftware(id: number): Promise<void> {
  await executeAsync('DELETE FROM software WHERE id = ?', [id]);
}