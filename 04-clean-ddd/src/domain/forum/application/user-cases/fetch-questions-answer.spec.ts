/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionsAnswerUseCase } from './fetch-questions-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionsAnswerUseCase

describe('Fetch question answers', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new FetchQuestionsAnswerUseCase(inMemoryAnswersRepository)
    })

    it('should be able to fecth question answers', async () => {
        await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityID('1')}))
        await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityID('1')}))
        await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityID('1')}))

        const result = await sut.execute({
            questionId: '1',
            page: 1
        })

        expect(result.value?.answers).toHaveLength(3)
    })

    it('should be able to fecth paginated question answers', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswersRepository.create(makeAnswer({ questionId: new UniqueEntityID('1')}))
        }

        const result = await sut.execute({
            questionId: '1',
            page: 2
        })

        expect(result.value?.answers).toHaveLength(2)
    })
})
