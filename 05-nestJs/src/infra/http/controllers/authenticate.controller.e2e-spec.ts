/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@faker-js/faker/.'

describe('Authenticate  (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test.skip('[POST] /sessions', async () => {
    await studentFactory.makePrismaStudent({
      email: 'johndoe@example.com',
      password: await hash('password123', 8),
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
