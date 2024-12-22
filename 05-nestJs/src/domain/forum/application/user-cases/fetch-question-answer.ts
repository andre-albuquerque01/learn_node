/* eslint-disable prettier/prettier */
import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionAnswerUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionAnswerUseCaseResponse= Either<null, {
  answers: Answer[]
}>

@Injectable()
export class FetchQuestionAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) { }

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswerUseCaseRequest): Promise<FetchQuestionAnswerUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })

    return right({ answers })
  }
}
