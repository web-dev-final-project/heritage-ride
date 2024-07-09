const db_url = process.env.DB_SERVER 
const database = process.env.DB_NAME

export const mongoConfig = {
    serverUrl: db_url,
    database: database
};