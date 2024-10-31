/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowError } from './error/not-allow-error'
import { InMemoryAnswersAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersAttachmentRepository: InMemoryAnswersAttachmentRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
    beforeEach(() => {
        inMemoryAnswersAttachmentRepository = new InMemoryAnswersAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentRepository)
        sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswersAttachmentRepository)
    })

    it('should be able to edit a answer by id', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryAnswersRepository.create(newAnswer)

        inMemoryAnswersAttachmentRepository.items.push(
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
            answerId: newAnswer.id.toValue(),
            authorId: '1',
            content: 'UUUUUU',
            attachmentsIds: ['1', '3'],
        })

        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'UUUUUU'
        })
        expect(
            inMemoryAnswersRepository.items[0].attachments.currentItems,
        ).toHaveLength(2)
        expect(
            inMemoryAnswersRepository.items[0].attachments.currentItems,
        ).toEqual([
            expect.objectContaining({ attachment: new UniqueEntityID('1') }),
            expect.objectContaining({ attachment: new UniqueEntityID('3') }),
        ])
    })

    it('should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: newAnswer.id.toValue(),
            authorId: '2',
            content: 'UUUUUU',
            attachmentsIds: [],
        })
        
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowError)
    })
})
