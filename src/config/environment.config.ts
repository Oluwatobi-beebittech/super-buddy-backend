import { DigitalOceanConfig } from './digitalocean.config';

console.log({ IS_PROD: process.env.IS_PROD });
const IS_PROD = JSON.parse(process.env.IS_PROD);
export const EnvConfig = IS_PROD
  ? { ...process.env, ...DigitalOceanConfig }
  : process.env;
