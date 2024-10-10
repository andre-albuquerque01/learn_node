import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Near Gym",
                description: "Cademia de baile e fitness",
                phone: "11999999999",
                latitude: -27.2092052,
                longitude: -49.6401091
            })

        await request(app.server)
            .post('/gyms/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Far Gym",
                description: "Cademia de baile e fitness",
                phone: "11999999999",
                latitude: -27.0610928,
                longitude: -49.5229501
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -27.0610928,
                longitude: -49.5229501
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.status).toBe(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: "Far Gym",
            })
        ])
    })
})