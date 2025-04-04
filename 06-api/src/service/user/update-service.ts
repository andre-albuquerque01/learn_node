import { compare, hash } from "bcryptjs";
import { UserRepository } from "@/repository/user-repository.e";

interface UserUpdateRequest {
    id: string,
    name: string,
    email: string,
    password: string
}

export class UpdateService {
    constructor(private userRepository: UserRepository) { }

    async execute({ id, name, email, password }: UserUpdateRequest) {
        const userWithSameEmail = await this.userRepository.findByEmail(email)

        if (userWithSameEmail && userWithSameEmail.id !== id) {
            throw new Error("Email already in use");
        }

        const checkUser = await this.userRepository.findById(id);

        if (!checkUser) {
            throw new Error("Usuário não encontrado");
        }
        
        const passwordIsCorrect = await compare(password, checkUser.password);

        if (!passwordIsCorrect) {
            throw new Error("Senha incorreta");
        }

        const user = await this.userRepository.updateUser({
            id,
            name,
            email,
            password
        })

        return { user }
    }
}