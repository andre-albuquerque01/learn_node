/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionsAttachmentRepository } from 'test/repositories/in-memory-questions-attachment-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentRepository: InMemoryQuestionsAttachmentRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentRepository = new InMemoryQuestionsAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentRepository)
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to get a question by slug', async () => {
        const newQuestion = makeQuestion({
            slug: Slug.create('slug'),
        })

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            slug: 'slug',
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: newQuestion.title,
            })
        })
    })
})
