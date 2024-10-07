import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { UserAlreadyExistError } from "@/services/errors/user-already-exist-error"
import { makeRegisterService } from "@/services/factories/make-register-service"

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
       const registerService = makeRegisterService()

        await registerService.execute({ name, email, password })
    } catch (error) {
        if (error instanceof UserAlreadyExistError) {
            return reply.status(409).send({ message: error.message })
        }

        throw error
        // return reply.status(500).send()
    }

    return reply.status(201).send()
} 