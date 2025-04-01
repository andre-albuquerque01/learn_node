import { UserPrisma } from "../../repository/prisma/user-prisma";
import { GetAllUser } from "../../service/user/get-all-users-service";

export function makeUserGetAllFactory() {
    const userRepository = new UserPrisma()
    const getAllUserService = new GetAllUser(userRepository)

    return getAllUserService
}