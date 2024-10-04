import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileServiceRequest {
    userId: string
}

interface GetUserProfileServiceResource {
    user: User
}

export class GetUserProfileService {
    constructor(
        private usersRepository: UsersRepository
    ) { }

    async execute({ userId }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResource> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundError()
        }

        return { user }
    }
}