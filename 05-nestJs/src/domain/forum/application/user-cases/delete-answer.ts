/* eslint-disable prettier/prettier */
import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowError } from '@/core/errors/error/not-allow-error'
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse  = Either<ResourceNotFoundError | NotAllowError, null>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowError())
    }

    await this.answerRepository.delete(answer)

    return right(null)
  }
}
