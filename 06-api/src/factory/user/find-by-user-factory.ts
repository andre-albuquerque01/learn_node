import { FindByIdUserService } from "@/service/user/find-by-id-user-service";
import { UserPrisma } from "../../repository/prisma/user-prisma";

export function makeUserFindAllUserFactory() {
    const userRepository = new UserPrisma()
    const findByIdUserService = new FindByIdUserService(userRepository)

    return findByIdUserService
}