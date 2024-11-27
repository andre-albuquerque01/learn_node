/* eslint-disable prettier/prettier */
import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionsAnswerUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionsAnswerUseCaseResponse= Either<null, {
  answers: Answer[]
}>

@Injectable()
export class FetchQuestionsAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) { }

  async execute({
    questionId,
    page,
  }: FetchQuestionsAnswerUseCaseRequest): Promise<FetchQuestionsAnswerUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })

    return right({ answers })
  }
}
