/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comment', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository(inMemoryStudentRepository)
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionsCommentsRepository)
  })

  it('should be able to fecth question comment', async () => {
    const student = makeStudent({ name: 'John doe' })

    inMemoryStudentRepository.items.push(student)

    const comment1 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('1'),
    })
    const comment2 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('1'),
    })
    const comment3 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('1'),
    })

    await inMemoryQuestionsCommentsRepository.create(comment1)
    await inMemoryQuestionsCommentsRepository.create(comment2)
    await inMemoryQuestionsCommentsRepository.create(comment3)

    const result = await sut.execute({
      questionId: '1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fecth paginated question comment', async () => {
    const student = makeStudent({ name: 'John doe' })

    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsCommentsRepository.create(
        makeQuestionComment({
          authorId: student.id,
          questionId: new UniqueEntityID('1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: '1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
