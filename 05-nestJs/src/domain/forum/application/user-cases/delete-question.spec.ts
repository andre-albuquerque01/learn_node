/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowError } from '@/core/errors/error/not-allow-error'
import { InMemoryQuestionsAttachmentRepository } from 'test/repositories/in-memory-questions-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
    let inMemoryQuestionsAttachmentRepository: InMemoryQuestionsAttachmentRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentRepository = new InMemoryQuestionsAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentRepository)
        sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to delete a question by id', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionsAttachmentRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachment: new UniqueEntityID('1')
            }),
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachment: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            questionId: '1',
            authorId: '1',
        })

        const question = await inMemoryQuestionsRepository.findById('1')

        expect(inMemoryQuestionsRepository.items).toHaveLength(0)
        expect(inMemoryQuestionsAttachmentRepository.items).toHaveLength(0)
        expect(question).toEqual(null)
    })

    it('should not be able to delete a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: '1',
            authorId: '2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowError)
    })
})
