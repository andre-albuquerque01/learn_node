/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowError } from '@/core/errors/error/not-allow-error'
import { InMemoryQuestionsAttachmentRepository } from 'test/repositories/in-memory-questions-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentRepository: InMemoryQuestionsAttachmentRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentRepository = new InMemoryQuestionsAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentRepository)
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionsAttachmentRepository)
    })

    it('should be able to edit a question by id', async () => {
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
            questionId: newQuestion.id.toValue(),
            authorId: '1',
            title: 'AAAAA',
            content: 'UUUUUU',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'AAAAA',
            content: 'UUUUUU'
        })
        expect(
            inMemoryQuestionsRepository.items[0].attachments.currentItems,
        ).toHaveLength(2)
        expect(
            inMemoryQuestionsRepository.items[0].attachments.currentItems,
        ).toEqual([
            expect.objectContaining({ attachment: new UniqueEntityID('1') }),
            expect.objectContaining({ attachment: new UniqueEntityID('3') }),
        ])
    })

    it('should not be able to edit a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: '1',
            authorId: '2',
            title: 'AAAAA',
            content: 'UUUUUU',
            attachmentsIds: []
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowError)
    })
})
