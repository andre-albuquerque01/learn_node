import { FastifyInstance } from "fastify";
import { register } from "./register";
import { getAllUsers } from "./get-all-user";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { authenticate } from "./authenticate";
import { update } from "./update";
import { findByIdUser } from "./find-by-id-user";
import { getByIdUser } from "./get-by-id-user";
import { deleteByIdUser } from "./delete-by-id-user";

export async function userRoutes(app: FastifyInstance) {
    app.post('/register', register)
    app.post('/sessions', authenticate)
    app.put('/update', { onRequest: [verifyJWT] }, update)
    app.get('/getAll', { onRequest: [verifyJWT] }, getAllUsers)
    app.get('/getAllById/:id', { onRequest: [verifyJWT] }, getByIdUser)
    app.get('/profile', { onRequest: [verifyJWT] }, findByIdUser)
    app.delete('/delete', { onRequest: [verifyJWT] }, deleteByIdUser)
}