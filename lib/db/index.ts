import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// pg warns that 'require'/'prefer'/'verify-ca' will weaken in v9; pin today's
// behavior (full certificate verification) explicitly to keep it and silence the warning.
function withVerifiedSsl(url: string | undefined) {
  if (!url) return url
  return url.replace(/([?&]sslmode=)(prefer|require|verify-ca)\b/, '$1verify-full')
}

export const pool = new Pool({ connectionString: withVerifiedSsl(process.env.DATABASE_URL) })
export const db = drizzle(pool, { schema })
