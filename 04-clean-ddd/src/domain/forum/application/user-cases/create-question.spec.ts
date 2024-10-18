import { expect, test } from 'vitest'
import { QuestionRepository } from '../repositories/question-repository'
import { CreateQuestionUseCase } from './create-question'

const fakeCreateQuestionRepository: QuestionRepository = {
  create: async () => {},
}

test('create a question', async () => {
  const createQuestion = new CreateQuestionUseCase(fakeCreateQuestionRepository)

  const { question } = await createQuestion.execute({
    authorId: '1',
    title: 'New question',
    content: "question's content",
  })

  expect(question.id).toBeTruthy()
})
