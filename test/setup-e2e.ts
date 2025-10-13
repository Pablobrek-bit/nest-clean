import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }
  const baseDatabaseUrl = new URL(process.env.DATABASE_URL);

  baseDatabaseUrl.searchParams.set('schema', `${schemaId}`);

  return baseDatabaseUrl.toString();
}

const schemaID = randomUUID();

beforeAll(async () => {
  const uniqueDatabaseURL = generateUniqueDatabaseURL(schemaID);
  process.env.DATABASE_URL = uniqueDatabaseURL;
  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaID}" CASCADE;`,
  );
  await prisma.$disconnect();
});
