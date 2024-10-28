/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowError } from './error/not-allow-error'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete answer', () => {
    beforeEach(() => {
        inMemoryAnswerRepository = new InMemoryAnswersRepository()
        sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
    })

    it('should be able to delete an answer by id', async () => {
        const newQuestion = makeAnswer({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryAnswerRepository.create(newQuestion)

        await sut.execute({
            answerId: '1',
            authorId: '1',
        })

        const question = await inMemoryAnswerRepository.findById('1')

        expect(inMemoryAnswerRepository.items).toHaveLength(0)
        expect(question).toEqual(null)
    })

    it('should not be able to delete an answer from another user', async () => {
        const newQuestion = makeAnswer({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryAnswerRepository.create(newQuestion)
        
        const result = await sut.execute({
            answerId: '1',
            authorId: '2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowError)
    })
})
