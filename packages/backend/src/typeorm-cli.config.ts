import * as dotenv from 'dotenv';
import { createTypeOrmConfig } from './configs/typeorm.config';

dotenv.config({ path: '.env.local' });

export default createTypeOrmConfig();
