import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Update (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to update', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await request(app.server)
            .put('/update')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'johndoe5@example.com',
                password: 'password123',
            })

        expect(response.status).toBe(201)
    })
})