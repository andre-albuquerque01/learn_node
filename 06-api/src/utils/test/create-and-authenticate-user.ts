import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { FastifyInstance } from "fastify"
import { randomUUID } from "node:crypto"
import request from "supertest"

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
    const email = `user-${randomUUID()}@example.com`

    await prisma.user.create({
        data: {
            name: 'John Doe',
            email,
            password: await hash('passwordTesteTeste1223@', 6),
        },
    })
    const authResponse = await request(app.server)
        .post('/sessions')
        .send({
            email,
            password: 'passwordTesteTeste1223@',
        })

    const { token } = authResponse.body

    return { token }
}