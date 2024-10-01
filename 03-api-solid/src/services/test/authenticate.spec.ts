import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { AuthenticateService } from "../authenticate"
import { hash } from "bcryptjs"
import { InvalidCredentialsError } from "../errors/invalid-credentials-error"

let sut: AuthenticateService
let userRepository: InMemoryUsersRepository

describe('Authenticate Service', () => {

    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        sut = new AuthenticateService(userRepository)
    })

    it('should be able to authenticate', async () => {
        await userRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('password123', 6),
        })

        const { user } = await sut.execute({
            email: 'johndoe@example.com',
            password: 'password123',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        await expect(() =>
            sut.execute({
                email: 'johndoe@example.com',
                password: 'password123',
            })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        await userRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('password123', 6),
        })

        await expect(() =>
            sut.execute({
                email: 'johndoe@example.com',
                password: 'passwordABC',
            })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})