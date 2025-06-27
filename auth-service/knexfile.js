const config = {
  development: {
    client: "postgresql",
    connection: {
      database: "microservice_db",
      user: "postgres",
      password: "scott",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_user_migrations",
      directory: "./config/migrations",
    },
  },
};
module.exports = config;
