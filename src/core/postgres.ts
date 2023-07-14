import { config } from '#config';
import createConnectionPool, { ConnectionPool } from '@databases/pg';
import { execSync } from 'child_process';

let db: ConnectionPool;

export const getPostgres = (): ConnectionPool => {
  if (!db) {
    if (!config.postgres.connectionString) {
      throw new Error(
        'Postgres connection string not set. Please define "DATABASE_URL" environment variable'
      );
    }

    if (!config.postgres.schemaName) {
      throw new Error(
        'Postgres schema name string not set. Please define "DATABASE_SCHEMA" environment variable'
      );
    }

    db = createConnectionPool({
      connectionString: config.postgres.connectionString,
      schema: config.postgres.schemaName,
    });
  }

  return db;
};

export const disconnectFromPostgres = async () => {
  const db = getPostgres();

  try {
    return await db.dispose();
  } catch (ex) {
    console.error(ex);
  }
};
