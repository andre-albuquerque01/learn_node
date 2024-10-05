import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { prisma } from "@/lib/prisma";

export class PrimsaGymsRepository implements GymsRepository {
    async findById(id: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id
            }
        })
        return gym
    }
    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            skip: (page - 1) * 20,
            take: 20
        })

        return gyms
    }
    async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
        const gym = await prisma.$queryRaw<Gym[]>`
            SELECT * FROM gyms
            WHERE (6371 * acos(
                cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) +
                sin(radians(${latitude})) * sin(radians(latitude))
            )) <= 10
        `

        return gym
    }
    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data
        })

        return gym
    }
}