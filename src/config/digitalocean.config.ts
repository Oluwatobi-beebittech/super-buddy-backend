type DigitalOceanConfig = {
  APP_SERVER_PORT: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_URL: string;
  NOTIONBUDDY_FRONTEND_BASE_URL: string;
  CANVA_JWKS_URL: string;
  NOTION_OAUTH_CLIENT_ID: string;
  NOTION_OAUTH_CLIENT_SECRET: string;
  NOTION_REDIRECT_URI: string;
  NOTION_RESPONSE_TYPE: string;
  NOTION_OWNER: string;
  NOTION_AUTH_URL: string;
  NOTIONBUDDY_APP_ID: string;
  NOTION_OAUTH_TOKEN_URL: string;
  NOTION_SEARCH_URL: string;
  NOTION_VERSION: string;
};

export const DigitalOceanConfig: DigitalOceanConfig = {
  APP_SERVER_PORT: process.env.PORT,
  DB_HOST: process.env.MYSQLHOST,
  DB_PORT: process.env.MYSQLPORT,
  DB_USER: process.env.MYSQLUSER,
  DB_PASSWORD: process.env.MYSQLPASSWORD,
  DB_DATABASE: process.env.MYSQL_DATABASE,
  DB_URL: process.env.MYSQL_URL,
  NOTIONBUDDY_FRONTEND_BASE_URL: process.env.NOTIONBUDDY_FRONTEND_BASE_URL,
  CANVA_JWKS_URL: process.env.CANVA_JWKS_URL,
  NOTION_OAUTH_CLIENT_ID: process.env.NOTION_OAUTH_CLIENT_ID,
  NOTION_OAUTH_CLIENT_SECRET: process.env.NOTION_OAUTH_CLIENT_SECRET,
  NOTION_REDIRECT_URI: process.env.NOTION_REDIRECT_URI,
  NOTION_RESPONSE_TYPE: process.env.NOTION_RESPONSE_TYPE,
  NOTION_OWNER: process.env.NOTION_OWNER,
  NOTION_AUTH_URL: process.env.NOTION_AUTH_URL,
  NOTIONBUDDY_APP_ID: process.env.NOTIONBUDDY_APP_ID,
  NOTION_OAUTH_TOKEN_URL: process.env.NOTION_OAUTH_TOKEN_URL,
  NOTION_SEARCH_URL: process.env.NOTION_SEARCH_URL,
  NOTION_VERSION: process.env.NOTION_VERSION,
};
