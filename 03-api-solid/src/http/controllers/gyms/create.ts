import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { makeCreateGymService } from "@/services/factories/make-create-gyms-service"

export async function createGym(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body)

    const gymService = makeCreateGymService()

    await gymService.execute({ title, description, phone, latitude, longitude })

    return reply.status(201).send()
} 