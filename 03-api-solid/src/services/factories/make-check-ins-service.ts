import { PrimsaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { CheckinService } from "../check-in"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"

export function makeCheckInService() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const gymRepository = new PrimsaGymsRepository()
    const service = new CheckinService(checkInsRepository, gymRepository)

    return service

}