import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../user-repository.e";
import { randomUUID } from "crypto";

export class UserInMemory implements UserRepository {
    public users: User[] = []

    async register(data: Prisma.UserCreateInput): Promise<User> {
        const user = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password: data.password,
        }
        this.users.push(user)
        return user
    }
    async updateUser(data: User): Promise<User> {
        const index = this.users.findIndex(user => user.id === data.id)
        if (index > 0) {
            this.users[index] = data
        }
        return data
    }
    async findAllUser(): Promise<User[] | null> {
        const user = this.users
        return user ? user : null
    }
    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find(item => item.email === email)
        return user ? user : null
    }
    async findById(id: string): Promise<User | null> {
        const user = this.users.find(item => item.id === id)
        return user ? user : null
    }
    async deleteById(id: string) {
        const index = this.users.findIndex(user => user.id === id)
        if (index > -1) {
            this.users.splice(index, 1)
        }
    }
}