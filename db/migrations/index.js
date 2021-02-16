const knexConnector = require("knex");
const knexfile = require("../knexfile");
module.exports = knexConnector(knexfile.development);