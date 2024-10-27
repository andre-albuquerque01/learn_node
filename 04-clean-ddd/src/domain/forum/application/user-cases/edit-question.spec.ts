/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowError } from './error/not-allow-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to edit a question by id', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: '1',
            title: 'AAAAA',
            content: 'UUUUUU'
        })

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'AAAAA',
            content: 'UUUUUU'
        })
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
            content: 'UUUUUU'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowError)
    })
})
