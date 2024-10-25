/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { NotAllowError } from './error/not-allow-error'

let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment', () => {
    beforeEach(() => {
        inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new DeleteAnswerCommentUseCase(inMemoryAnswersCommentsRepository)
    })

    it('should be able to delete a answer comment', async () => {
        const answerComment = makeAnswerComment()

        await inMemoryAnswersCommentsRepository.create(answerComment)

        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })

        expect(inMemoryAnswersCommentsRepository.items).toHaveLength(0)
    })


    it('should not be able to delete another user answer comment', async () => {
        const answerComment = makeAnswerComment({ authorId: new UniqueEntityID('1') })

        await inMemoryAnswersCommentsRepository.create(answerComment)

        const result = await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: '2',
        })
        
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowError)

    })
})
