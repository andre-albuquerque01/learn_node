import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Find by id user (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to find by id user', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await request(app.server)
            .get(`/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.status).toBe(200)
    })
})