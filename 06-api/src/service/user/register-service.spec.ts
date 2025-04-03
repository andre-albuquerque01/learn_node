import { beforeEach, describe, expect, it } from "vitest"
import { UserInMemory } from "@/repository/in-memory/user-in-memory"
import { hash } from "bcryptjs"
import { RegisterService } from "./register-service"

let sut: RegisterService
let userRepository: UserInMemory

describe('Register user', () => {
    beforeEach(() => {
        userRepository = new UserInMemory()
        sut = new RegisterService(userRepository)
    })

    it('should register user', async () => {
        const { user } = await sut.execute({
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
        await expect(() =>
            sut.execute({
                name: 'Jane Doe',
                email: 'johndoe1@example.com',
                password: 'password123',
            })
        ).rejects.toThrow("Email already exists")
    })
})
