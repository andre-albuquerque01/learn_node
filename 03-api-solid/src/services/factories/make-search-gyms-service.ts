import { SearchGymsService } from "../search-gyms"
import { PrimsaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"

export function makeSearchGymsService() {
    const gymRepository = new PrimsaGymsRepository()
    const service = new SearchGymsService(gymRepository)

    return service
}