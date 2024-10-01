import { expect, describe, it, beforeEach } from "vitest"
import { RegisterService } from "../register"
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistError } from "../errors/user-already-exist-error";
import { CreateGymService } from "../create-gym";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {

    beforeEach(() => {
        gymRepository = new InMemoryGymsRepository()
        sut = new CreateGymService(gymRepository)
    })

    it('should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: "Minha cademia favorita",
            description: "Cademia de baile e fitness",
            phone: "11999999999",
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        expect(gym.id).toEqual(expect.any(String))
    })

})