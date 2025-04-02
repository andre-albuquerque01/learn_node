import { FastifyReply, FastifyRequest } from "fastify"
import { makeUserGetAllFactory } from "@/factory/user/get-all-factory"

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
        const getAllUserService = makeUserGetAllFactory()

        const user = await getAllUserService.execute()

        return reply.status(200).send(user)
    } catch (err) {
        reply.status(400).send({ message: 'Error' })
    }
}