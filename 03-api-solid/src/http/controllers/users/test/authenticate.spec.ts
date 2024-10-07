import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'

describe('Authenticate (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to authenticate', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
            })
        const response = await request(app.server)
            .post('/sessions')
            .send({
                email: 'johndoe@example.com',
                password: 'password123',
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            token: expect.any(String),
        })
    })
})