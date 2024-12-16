/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { DomainEvents } from '@/core/events/domain-events'
import { Redis } from 'ioredis'
import { envSchema } from '@/infra/env/env'

config({
  path: '.env',
  override: true,
})
config({
  path: '.env.test',
  override: true,
})

const env = envSchema.parse(process.env) 

const prisma = new PrismaClient()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('No DATABASE_URL environment variable found')
  }
  const url = new URL(env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseUrl(schemaId)
  
  process.env.DATABASE_URL = databaseURL

  DomainEvents.shouldRun = false

  await redis.flushdb()

  execSync('npx prisma migrate deploy')
})
afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
