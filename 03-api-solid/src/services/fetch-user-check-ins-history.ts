import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInsHistoryServiceRequest {
    userId: string
    page: number
}

interface FetchUserCheckInsHistoryServiceResource {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
    constructor(
        private checkInsRepository: CheckInsRepository
    ) { }

    async execute({ userId, page }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResource> {
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

        return { checkIns }
    }
}