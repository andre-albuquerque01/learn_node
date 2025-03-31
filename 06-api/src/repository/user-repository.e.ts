import { Prisma, User } from "@prisma/client";


export interface UserRepository {
    register(data: Prisma.UserCreateInput): Promise<User>
    updateUser(data: User): Promise<User>
    findAllUser(): Promise<User[] | null>
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
}