import tables from '@databases/pg-typed';
import DatabaseSchema from './__generated__';
import databaseSchema from './__generated__/schema.json';

const {
  user: user,
} = tables<DatabaseSchema>({
  databaseSchema,
});
export { user };