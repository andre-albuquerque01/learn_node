import { FetchNearbyGymsService } from "../fetch-nearby-gyms"
import { PrimsaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"

export function makeFetchNearbyGymsService() {
    const gymRepository = new PrimsaGymsRepository()
    const service = new FetchNearbyGymsService(gymRepository)

    return service
}