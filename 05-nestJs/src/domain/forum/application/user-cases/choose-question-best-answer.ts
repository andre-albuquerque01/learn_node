/* eslint-disable prettier/prettier */
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error'
import { NotAllowError } from '@/core/errors/error/not-allow-error'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse  = Either<ResourceNotFoundError | NotAllowError, {
  question: Question
}> 
@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository, 
    private questionRepository: QuestionRepository) {}

  async execute({
    answerId,
    authorId
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)
    
    if (!answer) {
     return left(new ResourceNotFoundError())
    }

    const question = await this.questionRepository.findById(answer.questionId.toString())
    
    if (!question) {
     return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({ question })

  }
}
