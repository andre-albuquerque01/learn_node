import { makeFetchUserCheckInsHistoryService } from "@/services/factories/make-fetch-user-check-ins-history-service"
import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics-service"
import { makeSearchGymsService } from "@/services/factories/make-search-gyms-service"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
    const getUserMetricsService = makeGetUserMetricsService()

    const { checkInsCount } = await getUserMetricsService.execute({ userId: request.user.sub })

    return reply.status(200).send({
        checkInsCount
    })
} 