import { config } from '#config';
import {
  EventStoreDBClient,
} from '@eventstore/db-client';


let eventStore: EventStoreDBClient;

export function getEventStore(): EventStoreDBClient {
  if (!config.eventStoreDB.connectionString) {
    throw new Error(
      'EventStoreDB connection string not set. Please define "ESDB_CONNECTION_STRING" environment variable'
    );
  }

  if (!eventStore) {
    eventStore = EventStoreDBClient.connectionString(
      config.eventStoreDB.connectionString
    );
  }

  return eventStore;
}

export const disconnectFromEventStore = async () => {
  const eventStore = getEventStore();

  try {
    return await eventStore.dispose();
  } catch (ex) {
    console.error(ex);
  }
};
