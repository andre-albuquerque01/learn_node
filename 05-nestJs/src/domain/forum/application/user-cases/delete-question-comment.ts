/* eslint-disable prettier/prettier */
import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { NotAllowError } from '@/core/errors/error/not-allow-error'
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowError, null>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== questionComment.authorId.toString()) {
      return left(new NotAllowError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right(null)
  }
}
