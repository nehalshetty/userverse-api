import { InMemoryStore } from "./in-memory-store";

/**
 * Database instance - In-memory stores for each table
 */
export const database = {
  users: new InMemoryStore(),
  sessions: new InMemoryStore(),
};

export type Database = typeof database;
