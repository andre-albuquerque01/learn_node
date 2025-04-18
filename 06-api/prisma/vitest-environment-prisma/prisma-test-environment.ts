import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { Environment } from 'vitest';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('No DATABASE_URL environment variable found');
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schema)

    return url.toString()
}

const PrismaEnvironment: Environment = {
    name: 'prisma',
    async setup() {
        const schema = randomUUID()
        const databaseURL = generateDatabaseURL(schema)

        process.env.DATABASE_URL = databaseURL

        execSync('npx prisma migrate deploy');

        return {
            async teardown() {
                await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
                await prisma.$disconnect()
            },
        }
    },
    transformMode: 'ssr' // ou 'web', conforme o necessário para seu ambiente
};

export default PrismaEnvironment;
