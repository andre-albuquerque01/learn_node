import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { makeUserFindAllUserFactory } from "@/factory/user/find-by-user-factory"

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const getUserSchema = z.object({
        id: z.string()
    })

    const data = getUserSchema.parse(request.params)
    try {
        const findByIdUserService = makeUserFindAllUserFactory()

        const user = await findByIdUserService.execute({ id: data.id })

        return reply.status(200).send(user)
    } catch (err) {
        reply.status(400).send({ message: 'Error' })
    }
}