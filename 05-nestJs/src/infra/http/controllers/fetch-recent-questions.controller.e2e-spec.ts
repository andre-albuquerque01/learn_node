/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test.skip('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: `Question 1`,
          content: `Content of question 1`,
          authorId: user.id,
          slug: 'question',
        },
        {
            title: `Question 2`,
            content: `Content of question 2`,
            authorId: user.id,
            slug: 'question',
          },
          {
            title: `Question 3`,
            content: `Content of question 3`,
            authorId: user.id,
            slug: 'question',
          },
          {
            title: `Question 4`,
            content: `Content of question 4`,
            authorId: user.id,
            slug: 'question',
          },
          {
            title: `Question 5`,
            content: `Content of question 5`,
            authorId: user.id,
            slug: 'question',
          },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
        questions: [
          expect.objectContaining({
            title: expect.any(String),
            content: expect.any(String),
          }),
        ],
    })
  })
})
