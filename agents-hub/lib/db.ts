import * as SQLite from 'expo-sqlite';

export type SQLiteParams = (string | number | null)[];

let database: SQLite.WebSQLDatabase | null = null;

export function getDb(): SQLite.WebSQLDatabase {
  if (!database) {
    database = SQLite.openDatabase('agents_hub.db');
  }
  return database;
}

export function executeAsync(sql: string, params: SQLiteParams = []): Promise<void> {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          () => resolve(),
          (_t, error) => {
            reject(error);
            return true;
          }
        );
      },
      (error) => reject(error)
    );
  });
}

export function queryAllAsync<T = any>(sql: string, params: SQLiteParams = []): Promise<T[]> {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.readTransaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          (_t, result) => {
            const items: T[] = [] as T[];
            const rows = result.rows;
            for (let i = 0; i < rows.length; i++) {
              items.push(rows.item(i));
            }
            resolve(items);
          },
          (_t, error) => {
            reject(error);
            return true;
          }
        );
      },
      (error) => reject(error)
    );
  });
}

export async function initializeDatabase(): Promise<void> {
  await executeAsync(
    `CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT,
      createdAt INTEGER NOT NULL
    )`
  );

  await executeAsync(
    `CREATE TABLE IF NOT EXISTS software (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      repoUrl TEXT,
      createdAt INTEGER NOT NULL
    )`
  );

  await executeAsync(
    `CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT,
      createdAt INTEGER NOT NULL
    )`
  );
}