import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Get by id user (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get by id user', async () => {
        const user = await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
            })

        const { token } = await createAndAuthenticateUser(app)

        const response = await request(app.server)
            .get(`/getAllById/${user.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.status).toBe(200)
    })
})