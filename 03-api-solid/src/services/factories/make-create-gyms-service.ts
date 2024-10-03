import { CreateGymService } from "../create-gym"
import { PrimsaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"

export function makeCreateGymService() {
    const gymRepository = new PrimsaGymsRepository()
    const service = new CreateGymService(gymRepository)

    return service
}