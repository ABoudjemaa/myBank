// vitest.setup.ts
import { config } from 'dotenv';
import { join } from 'path';

// Charge les variables depuis .env.local (ou .env.test si tu préfères)
config({ path: join(__dirname, '.env') });
