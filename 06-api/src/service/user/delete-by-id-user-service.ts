import { compare, hash } from "bcryptjs";
import { UserRepository } from "@/repository/user-repository.e";
import { User } from "@prisma/client";

interface UserDeleteByIdUserRequest {
    id: string
}

export class DeleteByIdUserService {
    constructor(private userRepository: UserRepository) { }

    async execute({ id }: UserDeleteByIdUserRequest) {
        const user = await this.userRepository.findById(id)

        if (!user) {
            throw new Error("Usuário não encontrado")
        }

        await this.userRepository.deleteById(id)
    }
}