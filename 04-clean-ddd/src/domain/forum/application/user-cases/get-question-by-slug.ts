/* eslint-disable prettier/prettier */
import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse= Either<ResourceNotFoundError, {
  question: Question
}>

export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findBySlug(slug)

    if(!question){
        return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
