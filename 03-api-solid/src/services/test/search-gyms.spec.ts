import { expect, describe, it, beforeEach } from "vitest"
import { SearchGymsService } from "../search-gyms"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search Gyms Service', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsService(gymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: "Js js",
            description: "Cademia de baile e fitness",
            phone: "11999999999",
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        await gymsRepository.create({
            title: "Ph hp",
            description: "Cademia de baile e fitness",
            phone: "11999999999",
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        const { gyms } = await sut.execute({
            query: "Ph hp",
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Ph hp", }),
        ])
    })

    it('should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Js js ${i}`,
                description: "Cademia de baile e fitness",
                phone: "11999999999",
                latitude: -27.2092052,
                longitude: -49.6401091
            })
        }

        const { gyms } = await sut.execute({
            query: 'Js js',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: `Js js 21` }),
            expect.objectContaining({ title: 'Js js 22' }),
        ])
    })
})