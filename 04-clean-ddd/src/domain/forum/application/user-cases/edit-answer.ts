/* eslint-disable prettier/prettier */
import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { NotAllowError } from './error/not-allow-error'

interface EditAnswerUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowError, {
  answer: Answer
}>

export class EditAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) { }

  async execute({
    authorId,
    questionId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(questionId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowError())
    }

    answer.content = content

    await this.answerRepository.save(answer)

    return right({ answer })
  }
}
