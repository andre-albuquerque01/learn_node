/* eslint-disable prettier/prettier */
import { QuestionRepository } from '../repositories/question-repository'
import { QuestionComment } from '../../enterprise/entities/question-comments'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error'
import { Either, left, right } from '@/core/either'

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<ResourceNotFoundError, {
  questionComment: QuestionComment
}>

export class CommentOnQuestionUseCase {
  constructor(private questionRepository: QuestionRepository, private questionCommentsRepository: QuestionCommentsRepository) { }

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }


    const questionComment = QuestionComment.create({ authorId: new UniqueEntityID(authorId), content, questionId: new UniqueEntityID(questionId) })

    await this.questionCommentsRepository.create(questionComment)

    return right({ questionComment })
  }
}
