import { beforeEach, describe, expect, it } from "vitest"
import { UserInMemory } from "@/repository/in-memory/user-in-memory"
import { hash } from "bcryptjs"
import { AuthenticateService } from "./authentication-service"

let sut: AuthenticateService
let userRepository: UserInMemory

describe('Authenticate user', () => {
    beforeEach(() => {
        userRepository = new UserInMemory()
        sut = new AuthenticateService(userRepository)
    })

    it('should authenticate user', async () => {
        const data = await userRepository.register({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: await hash('password123', 10),
        })

        const { user } = await sut.execute({
            email: data.email,
            password: 'password123',
        })

        expect(user.name).toBe('John Doe')
    })

    it('should not login user with wrong email', async () => {
        await expect(() =>
            sut.execute({
                email: 'johndoe1@example.com',
                password: 'password123',
            })
        ).rejects.toThrow("Usuário não encontrado")
    })

    it('should not login user with wrong password', async () => {
        const data = await userRepository.register({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: await hash('password123', 10),
        })

        await expect(() =>
            sut.execute({
                email: 'johndoe@example.com',
                password: 'password1234',
            })
        ).rejects.toThrow("Senha incorreta")
    })

})
