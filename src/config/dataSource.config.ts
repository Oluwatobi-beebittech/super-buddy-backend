import { DataSource } from 'typeorm';

import { typeOrmConfig } from './typeorm.config';

const AppDataSource = new DataSource(typeOrmConfig);
AppDataSource.initialize();

export default AppDataSource;
