import { DigitalOceanConfig } from './digitalocean.config';

const IS_PROD = JSON.parse(process.env.IS_PROD);
export const EnvConfig = IS_PROD ? DigitalOceanConfig : process.env;
