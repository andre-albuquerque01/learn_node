import fastify from "fastify";
import { userRoutes } from "./http/controller/user/routes";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    }
})

app.register(userRoutes)