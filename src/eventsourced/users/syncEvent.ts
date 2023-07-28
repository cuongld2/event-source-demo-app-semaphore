import { Transaction } from '@databases/pg';
import {user } from '../db';
import {
  UserEvent,
} from './events'

import {
    JSONRecordedEvent,
    RecordedEvent,
    AllStreamResolvedEvent
  } from '@eventstore/db-client';


export const isUserEvent = (
    event: RecordedEvent
  ): event is UserEvent & JSONRecordedEvent => {
    return (
      event != null &&
      (event.type === 'user-created')
    );
  };

export const insertUserWithNewEvent = (
  db: Transaction,
  resolvedEvent: AllStreamResolvedEvent
): Promise<void> => {

    if (
        resolvedEvent.event === undefined ||
        !isUserEvent(resolvedEvent.event)
      )
      
        return Promise.resolve();
  const { event } = resolvedEvent;
  
  return insertUser(db, event);
  
};

export const insertUser = async (
  db: Transaction,
  event: UserEvent,
): Promise<void> => {
  const User = user(db);

  await User.insertOrIgnore({
    username: event.data.username,
    fullName: event.data.fullName,
    createdAt: new Date(event.data.openedAt),
  });
};