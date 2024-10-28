/* eslint-disable prettier/prettier */
import { Either, left, right } from '@/core/either'
import { QuestionRepository } from '../repositories/question-repository'
import { NotAllowError } from './error/not-allow-error'
import { ResourceNotFoundError } from './error/resource-not-found-error'

interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowError, object>

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) { }

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowError())
    }

    await this.questionRepository.delete(question)

    return right({})
  }
}
