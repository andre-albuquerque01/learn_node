/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionUseCase } from './fecth-recent-questions'
import { InMemoryQuestionsAttachmentRepository } from 'test/repositories/in-memory-questions-attachment-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentRepository: InMemoryQuestionsAttachmentRepository
let sut: FetchRecentQuestionUseCase

describe('Fetch recent questions', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentRepository = new InMemoryQuestionsAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentRepository)
        sut = new FetchRecentQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to fecth recent questions', async () => {
        await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 12) }))
        await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 11) }))
        await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 10) }))

        const result = await sut.execute({
            page: 1
        })

        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: new Date(2022, 0, 12) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 11) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 10) }),
        ])
    })
   
    it('should be able to fecth paginated recent questions', async () => {
        for(let i = 1; i <= 22; i++){
            await inMemoryQuestionsRepository.create(makeQuestion())
        }

        const result = await sut.execute({
            page: 2
        })

        expect(result.value?.questions).toHaveLength(2)
    })
})
