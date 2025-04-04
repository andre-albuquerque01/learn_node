import { beforeEach, describe, expect, it } from "vitest"
import { UpdateService } from "./update-service"
import { UserInMemory } from "@/repository/in-memory/user-in-memory"
import { hash } from "bcryptjs"

let sut: UpdateService
let userRepository: UserInMemory

describe('Update user', () => {
    beforeEach(() => {
        userRepository = new UserInMemory()
        sut = new UpdateService(userRepository)
    })

    it('should update user', async () => {
        const data = await userRepository.register({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: await hash('password123', 10),
        })

        const { user } = await sut.execute({
            id: data.id,
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            password: 'password123',
        })

        expect(user.name).toBe('Jane Doe')
    })

    it('should not update user with already email', async () => {
        await userRepository.register({
            name: 'John Doe',
            email: 'johndoe1@example.com',
            password: await hash('password123', 10),
        })

        const data = await userRepository.register({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: await hash('password123', 10),
        })

        await expect(() =>
            sut.execute({
                id: data.id,
                name: 'Jane Doe',
                email: 'johndoe1@example.com',
                password: 'password123',
            })
        ).rejects.toThrow("Email already in use")
    })

    it('should not update user with wrong id', async () => {
        await expect(() =>
            sut.execute({
                id: 'wrong-id',
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                password: 'password123',
            })
        ).rejects.toThrow('Usuário não encontrado')
    })


})
