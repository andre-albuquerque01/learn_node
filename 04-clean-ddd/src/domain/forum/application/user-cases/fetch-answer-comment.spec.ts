/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comment', () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
    })

    it('should be able to fecth answer comment', async () => {
        await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('1')}))
        await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('1')}))
        await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('1')}))

        const result = await sut.execute({
            answerId: '1',
            page: 1
        })

        // expect(answerComment).toHaveLength(3)
        expect(result.value?.answerComment).toHaveLength(3)
    })

    it('should be able to fecth paginated answer comment', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('1')}))
        }

        const result = await sut.execute({
            answerId: '1',
            page: 2
        })

        expect(result.value?.answerComment).toHaveLength(2)
    })
})
