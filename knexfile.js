// Update with your config settings.
module.exports = {
    development: {
        client: "pg",
        connection: {
            database: "clucks",


        },
        migrations: {
            tablename: 'migrations',
            directory: "./db/migrations",


        },
        seeds: {
            directory: "./db/seeds",

        },
    },
};