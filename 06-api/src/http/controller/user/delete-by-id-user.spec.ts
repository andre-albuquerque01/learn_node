import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Delete user (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to delete user', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await request(app.server)
            .delete(`/delete`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.status).toBe(204)
    })
})