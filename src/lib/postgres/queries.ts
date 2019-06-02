import { Pool } from 'pg';

const {
    DB_USER,
    DB_HOST,
    DB_NAME,
    DB_PASS
} = process.env

export default new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASS,
    port: 5432,
});

// export default async (query:string, values:string[]) => {
//     try {
//       const results = await db.query(query, values)
//       await db.end()
//       return results
//     } catch (error) {
//       return { error }
//     }
//   }
