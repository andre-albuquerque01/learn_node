import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { ValidateCheckinService } from "../validate-check-in"

export function makeValidateCheckInService() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const service = new ValidateCheckinService(checkInsRepository)

    return service
}