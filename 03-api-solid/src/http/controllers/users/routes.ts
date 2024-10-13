import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { verifyJWT } from "../../middlewares/verify-jwt"
import { refresh } from "./refresh";

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)

    app.patch('/token/refreshToken', refresh)

    // Authenticated
    app.get('/me', { onRequest: [verifyJWT] }, profile)
}