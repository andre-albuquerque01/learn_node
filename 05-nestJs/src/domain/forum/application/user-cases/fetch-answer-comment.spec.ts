/* eslint-disable prettier/prettier */
import { expect, it, beforeEach } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comment', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fecth answer comment', async () => {
    const student = makeStudent({ name: 'John doe' })
    inMemoryStudentRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: '1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)

    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John doe',
          commentId: comment1.answerId,
        }),
        expect.objectContaining({
          author: 'John doe',
          commentId: comment2.answerId,
        }),
        expect.objectContaining({
          author: 'John doe',
          commentId: comment3.answerId,
        }),
      ]),
    )
  })

  it('should be able to fecth paginated answer comment', async () => {
    const student = makeStudent({ name: 'John doe' })
    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('1'), authorId: student.id }),
      )
    }

    const result = await sut.execute({
      answerId: '1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
