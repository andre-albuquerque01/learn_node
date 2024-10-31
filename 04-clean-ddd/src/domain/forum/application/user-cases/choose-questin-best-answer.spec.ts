/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-questin-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowError } from './error/not-allow-error'
import { InMemoryAnswersAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryQuestionsAttachmentRepository } from 'test/repositories/in-memory-questions-attachment-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswersAttachmentRepository
let inMemoryQuestionsAttachmentRepository: InMemoryQuestionsAttachmentRepository

let sut: ChooseQuestionBestAnswerUseCase

describe('Choose question best answer', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentRepository = new InMemoryQuestionsAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentRepository)
        inMemoryAnswerAttachmentRepository = new InMemoryAnswersAttachmentRepository()
        inMemoryAnswerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
        sut = new ChooseQuestionBestAnswerUseCase(inMemoryAnswerRepository, inMemoryQuestionsRepository)
    })

    it('should be able to choose the question best answer', async () => {
        const newQuestion = makeQuestion()

        const newAnswer = makeAnswer({
            questionId: newQuestion.id,
        })

        await inMemoryQuestionsRepository.create(newQuestion)
        await inMemoryAnswerRepository.create(newAnswer)

        await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: newQuestion.authorId.toString(),
        })

        expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(newAnswer.id)
    })

    it('should not be able to choose another user question best answer', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('1'),
        })

        const newAnswer = makeAnswer({
            questionId: newQuestion.id,
        })

        await inMemoryQuestionsRepository.create(newQuestion)
        await inMemoryAnswerRepository.create(newAnswer)

        await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: newQuestion.authorId.toString(),
        })

        const result = await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: '2',
        })
        
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowError)

    })
})
