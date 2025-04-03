import { UserRepository } from "@/repository/user-repository.e";

export class GetAllUser {
    constructor(private userRespository: UserRepository) { }

    async execute() {
        const user = await this.userRespository.findAllUser()
        return { user }
    }
}