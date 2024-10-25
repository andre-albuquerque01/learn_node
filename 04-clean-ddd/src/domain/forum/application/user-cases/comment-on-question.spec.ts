/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryQuestionsCommentsRepository = new InMemoryQuestionsCommentsRepository()
        sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionsCommentsRepository)
    })

    it('should be able to comment question', async () => {
        const newQuestion = makeQuestion()

        await inMemoryQuestionsRepository.create(newQuestion)

        await sut.execute({
            questionId: newQuestion.id.toString(),
            authorId: newQuestion.authorId.toString(),
            content: 'Hello World!',
        })

        expect(inMemoryQuestionsCommentsRepository.items[0].content).toEqual('Hello World!')
    })
})
