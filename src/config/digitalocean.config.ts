type DigitalOceanConfig = {
  APP_SERVER_PORT: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  FRONTEND_BASE_URL: string;
};

export const DigitalOceanConfig: DigitalOceanConfig = {
  APP_SERVER_PORT: process.env.PORT,
  DB_HOST: process.env.MYSQLHOST,
  DB_PORT: process.env.MYSQLPORT,
  DB_USER: process.env.MYSQLUSER,
  DB_PASSWORD: process.env.MYSQLPASSWORD,
  DB_DATABASE: process.env.MYSQLDATABASE,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
};
