/* eslint-disable prettier/prettier */
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionsAnswerUseCaseRequest {
  questionId: string
  page: number
}

interface FetchQuestionsAnswerUseCaseResponse {
  answers: Answer[]
}

export class FetchQuestionsAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) { }

  async execute({
    questionId,
    page,
  }: FetchQuestionsAnswerUseCaseRequest): Promise<FetchQuestionsAnswerUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })

    return { answers }
  }
}
