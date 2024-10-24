/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comment', () => {
    beforeEach(() => {
        inMemoryQuestionsCommentsRepository = new InMemoryQuestionsCommentsRepository()
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionsCommentsRepository)
    })

    it('should be able to fecth question comment', async () => {
        await inMemoryQuestionsCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('1')}))
        await inMemoryQuestionsCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('1')}))
        await inMemoryQuestionsCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('1')}))

        const { questionsComment } = await sut.execute({
            questionId: '1',
            page: 1
        })

        expect(questionsComment).toHaveLength(3)
    })

    it('should be able to fecth paginated question comment', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestionsCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityID('1')}))
        }

        const { questionsComment } = await sut.execute({
            questionId: '1',
            page: 2
        })

        expect(questionsComment).toHaveLength(2)
    })
})
