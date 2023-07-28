import {
    JSONEventType,
  } from '@eventstore/db-client';
  
  export type UserEvent = JSONEventType<
    'user-created',
    {
      username: string;
      fullName: string;
      openedAt: string;
    }
  >;
