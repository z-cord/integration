exports.module = {
    client: "pg",
    connection: process.env.DB_URI,
    pool: {
      min: 2,
      max: 10
    },
    migrations: { directory: "./lib/postgres/migrations" },
    seeds: { directory: "./lib/postgres/seeds" }
};
