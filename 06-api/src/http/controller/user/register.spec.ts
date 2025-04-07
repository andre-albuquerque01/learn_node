import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { randomBytes } from 'crypto'

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register', async () => {
        const randm = randomBytes(10)
        await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: `johndoea${randm}@example.com`,
                password: 'password123',
            })

        expect(response.status).toBe(200)
    })
})