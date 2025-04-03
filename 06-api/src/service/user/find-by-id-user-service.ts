import { compare, hash } from "bcryptjs";
import { UserRepository } from "@/repository/user-repository.e";
import { User } from "@prisma/client";

interface UserFindByIdUserRequest {
    id: string
}

interface UserFindByIdUserResponse {
    user: User
}

export class FindByIdUserService {
    constructor(private userRepository: UserRepository) { }

    async execute({ id }: UserFindByIdUserRequest): Promise<UserFindByIdUserResponse> {
        const user = await this.userRepository.findById(id)

        if (!user) {
            throw new Error("Usuário não encontrado")
        }

        return { user }
    }
}