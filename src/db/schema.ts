import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const newsTable = sqliteTable(
  "news_table",
  {
    id: int().primaryKey({ autoIncrement: true }),
    tseMsgIdn: int().notNull().unique(),
    dEven: int().notNull(),
    hEven: int().notNull(),
    tseTitle: text().notNull(),
    tseDesc: text().notNull(),
    flow: int().notNull(),
    createdAt: int().notNull(),
  },
  (table) => ({
    tseMsgIdnIdx: index("tseMsgIdnIdx").on(table.tseMsgIdn),
  })
);
