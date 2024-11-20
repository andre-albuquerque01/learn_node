/* eslint-disable prettier/prettier */
import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswersAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionsAttachmentRepository } from 'test/repositories/in-memory-questions-attachment-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { makeQuestion } from 'test/factories/make-question'
import { waitFor } from 'test/utils/wait-for'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentRepository: InMemoryQuestionsAttachmentRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswersAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: unknown
// let sendNotificationExecuteSpy: SpyInstace<[
// SendNotificationUseCaseRequest,
// Promise<SendNotificationUseCaseResponse>
// ]>

describe('On Answer Created', () => {
    beforeEach(()=>{
        inMemoryQuestionsAttachmentRepository = new InMemoryQuestionsAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentRepository)
        inMemoryAnswerAttachmentRepository = new InMemoryAnswersAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
    })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({questionId: question.id})

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
        expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
