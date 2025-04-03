import { beforeEach, describe, expect, it } from "vitest"
import { UserInMemory } from "@/repository/in-memory/user-in-memory"
import { GetAllUser } from "./get-all-users-service"

let sut: GetAllUser
let userRepository: UserInMemory

describe('Get all user', () => {
    beforeEach(() => {
        userRepository = new UserInMemory()
        sut = new GetAllUser(userRepository)
    })

    it('should get all users', async () => {
        await userRepository.register({
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            password: 'password123',
        })

        await userRepository.register({
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            password: 'password123',
        })

        const { user } = await sut.execute()

        expect(user).toHaveLength(2)
    })
})
