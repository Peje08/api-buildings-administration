const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: 8080,
  env: process.env.NODE_ENV,
  db: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_URL
  }
};