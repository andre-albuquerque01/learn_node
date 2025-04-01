import { FastifyReply, FastifyRequest } from "fastify";
import { makeUserFindAllUserFactory } from "@/factory/user/find-by-user-factory";

export async function findByIdUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const findByIdUserService = makeUserFindAllUserFactory()

        const user = await findByIdUserService.execute({ id: request.user.sub })

        return reply.status(200).send(user)
    } catch (error) {
        return reply.status(400).send({
            error: error instanceof Error ? error.message : "Erro desconhecido.",
        });
    }
}