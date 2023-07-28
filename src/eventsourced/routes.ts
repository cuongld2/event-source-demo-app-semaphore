import { NextFunction, Request, Response, Router } from 'express';
import { create } from './core/projection';
import { getEventStore } from '../core/eventstoredb';
import {UserEvent
  } from './users/events';

  import {  WhereCondition } from '@databases/pg-typed';
  import { user, } from './db';
  import { User } from './db/__generated__';
  import { getPostgres } from '#core/postgres';
  
export const router = Router();

export type CreateUserModel = {
username: string;
fullName: string;
};


export const sendCreated = (
  response: Response,
  username: string,
): void => {
  response.status(201).json({ username: username });
};

  
export const createUser = ({
username,fullName
}: CreateUserModel): UserEvent => {
return {
    type: 'user-created',
    data: {
    username,
    fullName,
    openedAt: new Date().toJSON(),
    },
};
};

router.post(
'/users',
async (request: Request, response: Response, next: NextFunction) => {
    try {
    const username = request.body.username;
    const fullName = request.body.fullName;
    const userEvent = createUser({username,fullName})
    const streamName = `user-${username}`;

    create(getEventStore(), streamName, userEvent);

    sendCreated(response, username);
    } catch (error) {
    console.error(error);
    next(error);
    }
}
);

router.get(
  '/users/:username',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const User = user(getPostgres());

      let query: WhereCondition<User> = {
        username: request.params.username,
      };


      const result = await User.findOne(query);

      if (result === null) {
        response.sendStatus(404);
        return;
      }
      response.send({
        ...result,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);
