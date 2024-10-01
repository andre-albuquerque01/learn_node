import { expect, describe, it, beforeEach, vi, afterEach } from "vitest"
import { InMemoryCheckRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { CheckinService } from "../check-in"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { Decimal } from "@prisma/client/runtime/library"
import { MaxNumberOfCheckInsError } from "../errors/max-number-of-check-ins"
import { MaxDistanceError } from "../errors/max-distance-error"

let sut: CheckinService
let checkInsRepository: InMemoryCheckRepository
let gymRepository: InMemoryGymsRepository

describe('Check-in Service', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckRepository()
        gymRepository = new InMemoryGymsRepository()
        sut = new CheckinService(checkInsRepository, gymRepository)

        vi.useFakeTimers()

        await gymRepository.create({
            id: 'gym-01',
            title: 'Gym 1',
            description: 'AAcad',
            phone: 'aaa',
            latitude: new Decimal(-27.2092052),
            longitude: new Decimal(-49.6401091)
        })


    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        await expect(sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        vi.setSystemTime(new Date(2022, 1, 21, 8, 0, 0, 0))
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async () => {
        gymRepository.items.push({
            id: 'gym-02',
            title: 'Gym 1',
            description: 'AAcad',
            phone: 'aaa',
            latitude: new Decimal(-27.0747279),
            longitude: new Decimal(-49.4889672)
        })

        await expect(() =>
            sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -27.2092052,
                userLongitude: -49.6401091
            })
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})