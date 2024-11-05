/* eslint-disable prettier/prettier */
import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error'
import { NotAllowError } from '@/core/errors/error/not-allow-error'
import { AnswerAttachmentRepository } from '../repositories/answer-attachment-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowError, {
  answer: Answer
}>

export class EditAnswerUseCase {
  constructor(private answerRepository: AnswersRepository, private answerAttachmentRepository: AnswerAttachmentRepository) { }

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowError())
    }

    const currentAnswerAttachment = await this.answerAttachmentRepository.findManyByAnswerId(answerId)
    const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachment)

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachment: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answerRepository.save(answer)

    return right({ answer })
  }
}
