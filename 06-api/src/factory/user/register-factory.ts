import { UserPrisma } from "../../repository/prisma/user-prisma";
import { RegisterService } from "../../service/user/register-service";

export function makeUserRegisterFactory() {
    const userRepository = new UserPrisma()
    const registerService = new RegisterService(userRepository)

    return registerService
}