/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowError } from '@/core/errors/error/not-allow-error'
import { InMemoryAnswersAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswersAttachmentRepository
let sut: DeleteAnswerUseCase

describe('Delete answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepository = new InMemoryAnswersAttachmentRepository()
        inMemoryAnswerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
        sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
    })

    it('should be able to delete an answer by id', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryAnswerRepository.create(newAnswer)

        inMemoryAnswerAttachmentRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachment: new UniqueEntityID('1')
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachment: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            answerId: '1',
            authorId: '1',
        })

        expect(inMemoryAnswerRepository.items).toHaveLength(0)
        expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0)
    })

    it('should not be able to delete an answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryAnswerRepository.create(newAnswer)
        
        const result = await sut.execute({
            answerId: '1',
            authorId: '2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowError)
    })
})
