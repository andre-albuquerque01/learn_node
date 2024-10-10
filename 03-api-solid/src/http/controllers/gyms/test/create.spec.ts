import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        const response = await request(app.server)
            .post('/gyms/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Minha cademia favorita",
                description: "Cademia de baile e fitness",
                phone: "11999999999",
                latitude: -27.2092052,
                longitude: -49.6401091
            })

        expect(response.status).toBe(201)
    })
})