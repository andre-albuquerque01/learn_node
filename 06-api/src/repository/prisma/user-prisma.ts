import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../user-repository.e";
import { prisma } from "@/lib/prisma";

export class UserPrisma implements UserRepository {
    async register(data: Prisma.UserCreateInput): Promise<User> {
        const user = await prisma.user.create({ data });
        return user
    }
    async findAllUser(): Promise<User[] | null> {
        const user = await prisma.user.findMany()
        if (!user) return null
        return user
    }
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        })
        if (!user) return null
        return user
    }
    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                id,
            },
        })
        if (!user) return null
        return user
    }
    async updateUser(data: User): Promise<User> {
        const res = await prisma.user.update({
            where: {
                id: data.id
            },
            data,
        })
        
        return res
    }
    async deleteById(id: string) {
        await prisma.user.delete({
            where: {
                id,
            },
        })
    }

}