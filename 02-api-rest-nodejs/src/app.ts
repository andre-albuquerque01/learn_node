import fastify from 'fastify'
import { env } from './env'
import { transactionRoutes } from './routes/transaction'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)
app.register(transactionRoutes, {
    prefix: 'transactions',
})
