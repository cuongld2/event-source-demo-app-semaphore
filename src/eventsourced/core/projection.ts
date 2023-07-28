import {
    EventStoreDBClient,
    jsonEvent,
    JSONEventType,
  } from '@eventstore/db-client';
  
  export const create =(
      eventStore: EventStoreDBClient,
      streamName: string,
      event: JSONEventType
    ) : void => {
      eventStore.appendToStream(streamName, jsonEvent(event), {
      });
    };
