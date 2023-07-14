import { disconnectFromEventStore, getEventStore } from '../core/eventstoredb';
import { router } from './routes';
import {
    handleEventInPostgresTransactionScope,
    SubscriptionToAll,
  } from './core/subscriptions';
  import { disconnectFromPostgres } from '#core/postgres';
  import { insertUserWithNewEvent } from './users/syncEvent';
process.once('SIGTERM', disconnectFromPostgres);
process.once('SIGTERM', disconnectFromEventStore);

import express, { Application, Router } from 'express';
import http from 'http';

export const getApplication = (router: Router) => {
  const app: Application = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(router);

  return app;
};

export const startAPI = (router: Router, port = 5000) => {
  const app = getApplication(router);

  const server = http.createServer(app);

  server.listen(port);

  server.on('listening', () => {
    console.info('server up listening');
  });
};

startAPI(router);


SubscriptionToAll(getEventStore, [
  handleEventInPostgresTransactionScope(insertUserWithNewEvent),
]);