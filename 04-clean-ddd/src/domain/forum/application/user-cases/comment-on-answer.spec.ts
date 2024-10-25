/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswersCommentsRepository)
    })

    it('should be able to comment answer', async () => {
        const newAnswer = makeAnswer()

        await inMemoryAnswersRepository.create(newAnswer)

        await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: newAnswer.authorId.toString(),
            content: 'Hello World!',
        })

        expect(inMemoryAnswersCommentsRepository.items[0].content).toEqual('Hello World!')
    })
})
