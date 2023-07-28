import { getPostgres } from '#core/postgres';
import { Transaction } from '@databases/pg';
import {
  AllStreamResolvedEvent,
  EventStoreDBClient,
  excludeSystemEvents,
} from '@eventstore/db-client';
import { finished, Readable } from 'stream';

export type EventHandler = (event: AllStreamResolvedEvent) => Promise<void>;

export const SubscriptionToAll =
  (
    getEventStore: () => EventStoreDBClient,handlers: EventHandler[]
  ) => {
      const subscription = getEventStore().subscribeToAll({
        filter: excludeSystemEvents(),
      });

      finished(
        subscription.on(
          'data',
          async (resolvedEvent: AllStreamResolvedEvent) => {
            for (const handler of handlers) {
                console.log(resolvedEvent);
                await handler({ ...resolvedEvent });
            }

          }
        ) as Readable,
        (error) => {
          if (!error) {
            console.info(`Stopping subscription.`);
            return;
          }
          console.error(
            `Received error: %s. Retrying.`,
            error ?? 'UNEXPECTED ERROR'
          );
          throw error;
        }
      );
      console.info('Subscription is running');

      return subscription;

  };

export type PostgresEventHandler = (
  db: Transaction,
  event: AllStreamResolvedEvent
) => Promise<void>;


export const handleEventInPostgresTransactionScope =
  (handle: PostgresEventHandler) =>
  async (event: AllStreamResolvedEvent) => {
    await getPostgres().tx(async (transaction) => {
      await transaction.task(async (db) => {
          // console.log(event);
          await handle(db, event);        
      });
    });
  };
