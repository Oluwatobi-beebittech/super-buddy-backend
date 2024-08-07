FROM node:18 as super-buddy

# Define ARG for app environment variable
ARG APP_SERVER_PORT
ARG DB_TYPE
ARG DB_SERVER
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_DATABASE
ARG DB_MIGRATIONS_RUN_ON_START
ARG IS_PROD
ARG NOTIONBUDDY_FRONTEND_BASE_URL
ARG NOTION_OAUTH_CLIENT_ID
ARG NOTION_OAUTH_CLIENT_SECRET
ARG NOTION_REDIRECT_URI
ARG NOTION_RESPONSE_TYPE
ARG NOTION_OWNER
ARG NOTION_AUTH_URL
ARG NOTIONBUDDY_APP_ID
ARG CANVA_JWKS_URL
ARG NOTION_OAUTH_TOKEN_URL
ARG NOTION_SEARCH_URL
ARG NOTION_VERSION

# Echo each environment variable
RUN echo $APP_SERVER_PORT
RUN echo $DB_TYPE
RUN echo $DB_SERVER
RUN echo $DB_HOST
RUN echo $DB_PORT
RUN echo $DB_USER
RUN echo $DB_PASSWORD
RUN echo $DB_DATABASE
RUN echo $DB_MIGRATIONS_RUN_ON_START
RUN echo $IS_PROD
RUN echo $NOTIONBUDDY_FRONTEND_BASE_URL
RUN echo $NOTION_OAUTH_CLIENT_ID
RUN echo $NOTION_OAUTH_CLIENT_SECRET
RUN echo $NOTION_REDIRECT_URI
RUN echo $NOTION_RESPONSE_TYPE
RUN echo $NOTION_OWNER
RUN echo $NOTION_AUTH_URL
RUN echo $NOTIONBUDDY_APP_ID
RUN echo $CANVA_JWKS_URL
RUN echo $NOTION_OAUTH_TOKEN_URL
RUN echo $NOTION_SEARCH_URL
RUN echo $NOTION_VERSION

# Define ARG for Railway environment variable
ARG PORT
ARG MYSQLHOST
ARG MYSQLPORT
ARG MYSQLUSER
ARG MYSQLPASSWORD
ARG MYSQLDATABASE

# Echo each environment variable
RUN echo $PORT
RUN echo $MYSQLHOST
RUN echo $MYSQLPORT
RUN echo $MYSQLUSER
RUN echo $MYSQLPASSWORD
RUN echo $MYSQLDATABASE


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]
