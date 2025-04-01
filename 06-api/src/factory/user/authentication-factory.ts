import { AuthenticateService } from "@/service/user/authentication-service";
import { UserPrisma } from "../../repository/prisma/user-prisma";

export function makeUserAuthenticationFactory() {
    const userRepository = new UserPrisma()
    const authenticateService = new AuthenticateService(userRepository)

    return authenticateService
}