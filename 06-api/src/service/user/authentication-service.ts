import { compare } from "bcryptjs";
import { UserRepository } from "@/repository/user-repository.e";

interface AuthenticateRequest {
    email: string,
    password: string
}

export class AuthenticateService {
    constructor(private userRepository: UserRepository) { }

    async execute({ email, password }: AuthenticateRequest) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const passwordIsCorrect = await compare(password, user.password);

        if (!passwordIsCorrect) {
            throw new Error("Senha incorreta")
        }

        return { user }
    }
}