import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { hash } from "bcryptjs"
import { GetUserProfileService } from "../get-user-profile"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

let sut: GetUserProfileService
let userRepository: InMemoryUsersRepository

describe('Get USer Profile Service', () => {

    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileService(userRepository)
    })

    it('should be able to get user profile', async () => {
        const createdUser = await userRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('password123', 6),
        })

        const { user } = await sut.execute({
            userId: createdUser.id,
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('John Doe')
    })

    it('should not be able to get user profile with wrong id', async () => {
        await expect(() =>
            sut.execute({
                userId: 'non-existing-id'
            })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})