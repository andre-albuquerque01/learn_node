import { FastifyInstance } from "fastify";
import { register } from "./register";
import { getAllUsers } from "./get-all-user";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function userRoutes(app: FastifyInstance) {
    app.get('/users', async (req, res) => {
        res.send({ message: 'Hello from users route' })
    })

    app.post('/register', register)
    app.get('/getAll', { onRequest: [verifyJWT] }, getAllUsers)
}