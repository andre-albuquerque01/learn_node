import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'

describe('Profile (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get user profile', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
            })
        const authResponse = await request(app.server)
            .post('/sessions')
            .send({
                email: 'johndoe@example.com',
                password: 'password123',
            })

        const { token } = authResponse.body

        const profileResponse = await request(app.server)
            .get('/me')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(profileResponse.status).toBe(200)
        expect(profileResponse.body.user).toEqual(expect.objectContaining({
            email: 'johndoe@example.com',
        }))
    })
})