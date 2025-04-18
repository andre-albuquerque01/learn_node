import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt"

import { create } from "./create";
import { search } from "./search";
import { nearby } from "./nearby";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.get('/gyms/search', search)
    app.get('/gyms/nearby', nearby)

    app.post('/gyms/create', { onRequest: [verifyUserRole('ADMIN')] }, create)
} 