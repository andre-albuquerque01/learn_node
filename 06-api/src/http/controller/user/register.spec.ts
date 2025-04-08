import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { randomUUID } from 'node:crypto'

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register', async () => {
        const email = `user-${randomUUID()}@example.com`
        const response = await request(app.server)
            .post('/register')
            .send({
                name: 'John Doe',
                email,
                password: 'password123@Asaa',
            })

        expect(response.status).toBe(201)
    })
})