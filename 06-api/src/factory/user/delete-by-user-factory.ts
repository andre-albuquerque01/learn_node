import { UserPrisma } from "../../repository/prisma/user-prisma";
import { DeleteByIdUserService } from "@/service/user/delete-by-id-user-service";

export function makeUserDeleteByIdFactory() {
    const userRepository = new UserPrisma()
    const deleteByIdUserService = new DeleteByIdUserService(userRepository)

    return deleteByIdUserService
}