import { doublePrecision, index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// Better Auth's user/session/account/verification tables are managed by Better Auth itself
// through the shared pg Pool, so only app tables are declared here.

export const savedTrips = pgTable(
  'saved_trips',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    fromId: text('fromId').notNull(),
    toId: text('toId').notNull(),
    mode: text('mode').notNull(),
    distanceKm: doublePrecision('distanceKm').notNull(),
    co2SavedGrams: doublePrecision('co2SavedGrams').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (t) => [index('saved_trips_user_idx').on(t.userId)],
)
