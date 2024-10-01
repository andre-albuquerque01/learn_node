import { expect, describe, it, beforeEach } from "vitest"
import { RegisterService } from "../register"
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistError } from "../errors/user-already-exist-error";

let sut: RegisterService
let userRepository: InMemoryUsersRepository

describe('Register Service', () => {

    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        sut = new RegisterService(userRepository)
    })

    it('should be able to register', async () => {
        const { user } = await      sut.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
        })


        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const { user } = await      sut.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
        })

        const isPasswordCorrectlyhashed = await compare('password123', user.password_hash)

        expect(isPasswordCorrectlyhashed).toBe(true)
    })

    it('should not be able to register a user with same email twice', async () => {
        const email = 'johndoe@example.com'

        await       sut.execute({
            name: 'John Doe',
            email,
            password: 'password123',
        })

        await expect(() => 
                    sut.execute({
            name: 'John Doe',
            email,
            password: 'password123',
        })).rejects.toBeInstanceOf(UserAlreadyExistError)
    })

})