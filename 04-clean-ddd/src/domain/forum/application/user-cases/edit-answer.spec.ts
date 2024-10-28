/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowError } from './error/not-allow-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new EditAnswerUseCase(inMemoryAnswersRepository)
    })

    it('should be able to edit a answer by id', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryAnswersRepository.create(newAnswer)

        await sut.execute({
            questionId: newAnswer.id.toValue(),
            authorId: '1',
            content: 'UUUUUU'
        })

        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'UUUUUU'
        })
    })

    it('should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('1')
        }, new UniqueEntityID('1'))

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            questionId: newAnswer.id.toValue(),
            authorId: '2',
            content: 'UUUUUU'
        })
        
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowError)
    })
})
