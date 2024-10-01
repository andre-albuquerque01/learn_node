import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryCheckRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { GetUserMetricsService } from "../get-user-metrics"

let checkInsRepository: InMemoryCheckRepository
let sut: GetUserMetricsService

describe('Get User Metrics Service', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckRepository()
        sut = new GetUserMetricsService(checkInsRepository)
    })

    it('should be able to check-ins count from metrics', async () => {
        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01',
        })

        const { checkInsCount } = await sut.execute({
            userId: 'user-01',
        })

        expect(checkInsCount).toEqual(2)
    })
})