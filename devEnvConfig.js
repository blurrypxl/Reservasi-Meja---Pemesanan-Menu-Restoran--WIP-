require("dotenv").config({ path: process.env.DEV_ENV });

module.exports = {
  masterkey: process.env.API_KEY,
  port: process.env.PORT
};
