import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsServiceRequest {
    userId: string
}

interface GetUserMetricsServiceResource {
    checkInsCount: number
}

export class GetUserMetricsService {
    constructor(
        private checkInsRepository: CheckInsRepository
    ) { }

    async execute({ userId }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResource> {
        const checkInsCount = await this.checkInsRepository.countByUserId(userId)

        return { checkInsCount }
    }
}