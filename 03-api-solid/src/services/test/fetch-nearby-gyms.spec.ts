import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { FetchNearbyGymsService } from "../fetch-nearby-gyms"

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fecth Nearby Gyms Service', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsService(gymsRepository)
    })

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: "Near Gym",
            description: "Cademia de baile e fitness",
            phone: "11999999999",
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        await gymsRepository.create({
            title: "Far Gym",
            description: "Cademia de baile e fitness",
            phone: "11999999999",
            latitude: -27.0610928,
            longitude: -49.5229501
        })

        const { gyms } = await sut.execute({
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Near Gym", }),
        ])
    })
})