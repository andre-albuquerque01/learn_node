import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUserUpdateFactory } from "@/factory/user/update-factory";

export async function update(request: FastifyRequest, reply: FastifyReply) {
    const updateSchema = z.object({
        name: z.string().min(2).max(20),
        email: z.string().email(),
        password: z
            .string()
            .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
            .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula." })
            .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
            .regex(/[^A-Za-z0-9]/, { message: "A senha deve conter pelo menos um caractere especial." }),
    })

    const { name, email, password } = updateSchema.parse(request.body)

    try {
        const updateService = makeUserUpdateFactory()

        const user = await updateService.execute({ id: request.user.sub, name, email, password })

        return reply.status(201).send(user)
    } catch (error) {
        return reply.status(400).send({
            error: error instanceof Error ? error.message : "Erro desconhecido.",
        });
    }
}