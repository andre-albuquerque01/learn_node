import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { randomBytes } from "crypto"
import { FastifyInstance } from "fastify"
import request from "supertest"

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
    const randm = randomBytes(10)
    await prisma.user.create({
        data: {
            name: 'John Doe',
            email: `johndoe${randm}@example.com`,
            password: await hash('1234567', 6),
        },
    })
    const authResponse = await request(app.server)
        .post('/sessions')
        .send({
            email: `johndoe${randm}@example.com`,
            password: '1234567',
        })

    const { token } = authResponse.body

    return { token }
}