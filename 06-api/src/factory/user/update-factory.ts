import { UserPrisma } from "../../repository/prisma/user-prisma";
import { UpdateService } from "../../service/user/update-service";

export function makeUserUpdateFactory() {
    const userRepository = new UserPrisma()
    const updateService = new UpdateService(userRepository)

    return updateService
}