import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistError } from "./errors/user-already-exist-error"
import { User } from "@prisma/client"

interface RegisterServiceRequest {
    name: string
    email: string
    password: string
}

interface RegisterUserServiceResponse {
    user: User
}

export class RegisterService {
    constructor(private userRepository: UsersRepository) { }

    async execute({ name, email, password }: RegisterServiceRequest): Promise<RegisterUserServiceResponse> {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this.userRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistError()
        }

        const user = await this.userRepository.create({
            name,
            email,
            password_hash,
        })

        return { user }
    }
}