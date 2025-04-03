import { hash } from "bcryptjs";
import { UserRepository } from "@/repository/user-repository.e";

interface UserRequest {
    name: string,
    email: string,
    password: string
}

export class RegisterService {
    constructor(private userRepository: UserRepository) { }

    async execute({ name, email, password }: UserRequest) {
        const validateEmail = await this.userRepository.findByEmail(email)
        if (validateEmail) {
            throw new Error('Email already exists')
        }

        const hashedPassword = await hash(password, 10)

        const user = await this.userRepository.register({
            name,
            email,
            password: hashedPassword
        })

        return { user }
    }
}