import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { randomUUID } from 'node:crypto'

describe('Authenticate (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to authenticate', async () => {
        const email = `user-${randomUUID()}@example.com`

        await request(app.server)
            .post('/register')
            .send({
                name: 'John Doe',
                email,
                password: '@passWorda123',
            })

        const response = await request(app.server)
            .post('/sessions')
            .send({
                email,
                password: '@passWorda123',
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            token: expect.any(String),
        })
    })
})