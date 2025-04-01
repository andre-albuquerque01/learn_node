import { makeUserDeleteByIdFactory } from "@/factory/user/delete-by-user-factory";
import { FastifyReply, FastifyRequest } from "fastify";

export async function deleteByIdUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const deleteByIdUserService = makeUserDeleteByIdFactory()

        await deleteByIdUserService.execute({ id: request.user.sub })

        return reply.status(204).send()
    } catch (error) {
        return reply.status(400).send({
            error: error instanceof Error ? error.message : "Erro desconhecido.",
        });
    }
}