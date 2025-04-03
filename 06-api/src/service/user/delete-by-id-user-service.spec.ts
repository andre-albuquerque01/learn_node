import { beforeEach, describe, expect, it } from "vitest"
import { UserInMemory } from "@/repository/in-memory/user-in-memory"
import { hash } from "bcryptjs"
import { DeleteByIdUserService } from "./delete-by-id-user-service"

let sut: DeleteByIdUserService
let userRepository: UserInMemory

describe('Delete user', () => {
    beforeEach(() => {
        userRepository = new UserInMemory()
        sut = new DeleteByIdUserService(userRepository)
    })

    it('should delete user', async () => {
        const data = await userRepository.register({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: await hash('password123', 10),
        })

        await expect(() =>
            sut.execute({
                id: data.id,
            })
        ).toBeTruthy()
    })

    it('should not find user', async () => {
        await expect(() =>
            sut.execute({
                id: 'sadasda',
            })
        ).rejects.toThrow("Usuário não encontrado")
    })
})
