import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUserAuthenticationFactory } from "@/factory/user/authentication-factory";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateSchema = z.object({
        email: z.string().email(),
        password: z
            .string()
            .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
            .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula." })
            .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
            .regex(/[^A-Za-z0-9]/, { message: "A senha deve conter pelo menos um caractere especial." }),
    })

    const data = authenticateSchema.parse(request.body)

    try {
        const authenticateService = makeUserAuthenticationFactory()

        const { user } = await authenticateService.execute(data)

        const token = await reply.jwtSign({}, {
            sign: {
                sub: user.id
            },
        })

        return reply.status(200).send({ token })
    } catch (error) {
        return reply.status(400).send({
            error: error instanceof Error ? error.message : "Erro desconhecido.",
        });
    }
}