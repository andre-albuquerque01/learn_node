/* eslint-disable prettier/prettier */
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'

describe('Authenticate  (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test.skip('[POST] /sessions', async () => {
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('password123', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/accounts').send({
      email: 'johndoe@example.com',
      password: 'password123',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String)
    })
  })
})
