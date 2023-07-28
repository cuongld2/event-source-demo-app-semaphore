import convict from 'convict';


const convictConfig = convict({
  eventStoreDB: {
    connectionString: {
      format: String,
      default: 'esdb://localhost:2113?tls=false&throwOnAppendFailure=false',
      arg: 'ESDB_CONNECTION_STRING',
      env: 'ESDB_CONNECTION_STRING',
    },
  },
  postgres: {
    connectionString: {
      format: String,
      default: 'postgres://postgres:Password12!@localhost:5432/postgres',
      arg: 'DATABASE_URL',
      env: 'DATABASE_URL',
    },
    schemaName: {
      format: String,
      default: 'eventsourcing',
      arg: 'DATABASE_SCHEMA',
      env: 'DATABASE_SCHEMA',
    },
  },
});

convictConfig.validate({ allowed: 'strict' });

export const config = convictConfig.getProperties();
