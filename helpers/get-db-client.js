/**
 * @type {Knex}
 */
const database = require("knex")({
  client: "postgres",
  connection: {
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER_NAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_NAME,
  },
});

module.exports = { database };
