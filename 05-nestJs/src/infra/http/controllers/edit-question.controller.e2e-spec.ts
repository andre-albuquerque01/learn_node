/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@faker-js/faker/.'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Edit question  (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test.skip('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    
    const question = await questionFactory.makePrismaQuestion({
      title: `Question 1`,
      authorId: user.id,
    })
    
    const questionId = question.id.toString()
    
    await questionAttachmentFactory.makePrismaAttachment({
      attachment: attachment1.id,
      questionId: question.id
    })
    await questionAttachmentFactory.makePrismaAttachment({
      attachment: attachment2.id,
      questionId: question.id
    })

    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New title',
        content: 'New content',
        attachments: [
          attachment1.id.toString(),
          attachment3.id.toString(),
        ]
      })

    expect(response.status).toBe(204)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New title',
        content: 'New content',
      },
    })

    expect(questionOnDatabase).toBeTruthy()

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id
      },
    })

    expect(attachmentOnDatabase.length).toBe(2)
    expect(attachmentOnDatabase).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: attachment1.id.toString(),
      }),
      expect.objectContaining({
        id: attachment3.id.toString(),
      }),
    ]))
  })
})
