import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.dev.env') });
