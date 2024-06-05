import { custom } from 'astro/zod';
import { column, defineDb, defineTable } from 'astro:db';

const User = defineTable({  
  columns: {
    id: column.number({primaryKey: true}),
    name: column.text(),
    email: column.text(),
  }
})

const ShortUrl = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number({ references: () => User.columns.id, optional: true }),
    url: column.text(),
    code: column.text(),
    custom: column.boolean(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    ShortUrl,
  }
});
