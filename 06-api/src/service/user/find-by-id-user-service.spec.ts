import { beforeEach, describe, expect, it } from "vitest"
import { UserInMemory } from "@/repository/in-memory/user-in-memory"
import { hash } from "bcryptjs"
import { FindByIdUserService } from "./find-by-id-user-service"

let sut: FindByIdUserService
let userRepository: UserInMemory

describe('Find user', () => {
    beforeEach(() => {
        userRepository = new UserInMemory()
        sut = new FindByIdUserService(userRepository)
    })

    it('should find user', async () => {
        const data = await userRepository.register({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: await hash('password123', 10),
        })

        const { user } = await sut.execute({
            id: data.id,
        })

        expect(user.name).toBe('John Doe')
    })

    it('should not find user', async () => {
        await expect(() =>
            sut.execute({
                id: 'sadasda',
            })
        ).rejects.toThrow("Usuário não encontrado")
    })
})
