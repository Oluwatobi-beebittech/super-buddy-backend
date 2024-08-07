import { DigitalOceanConfig } from './digitalocean.config';

console.log({ IS_PROD: process.env.IS_PROD, dd: process.env.MYSQLHOST });
const IS_PROD = JSON.parse(process.env.IS_PROD);
export const EnvConfig = IS_PROD ? DigitalOceanConfig : process.env;
