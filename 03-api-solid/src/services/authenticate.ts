import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateServiceRequest {
    email: string,
    password: string
}

interface AuthenticateServiceResource {
    user: User
}

export class AuthenticateService {
    constructor(
        private usersRepository: UsersRepository
    ) { }

    async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResource> {
        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatchs = await compare(password, user.password_hash)

        if (!doesPasswordMatchs) {
            throw new InvalidCredentialsError()
        }

        return { user }
    }
}