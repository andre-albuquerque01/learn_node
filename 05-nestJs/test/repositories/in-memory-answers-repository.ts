/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { InMemoryAnswersAttachmentRepository } from './in-memory-answer-attachment-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private inMemoryAnswerAttachmentRepository: InMemoryAnswersAttachmentRepository,
  ) {}

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)
    if (!answer) return null
    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async create(answer: Answer) {
    this.items.push(answer)

    await this.inMemoryAnswerAttachmentRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items[itemIndex] = answer

    await this.inMemoryAnswerAttachmentRepository.createMany(
      answer.attachments.getNewItems(),
    )
    await this.inMemoryAnswerAttachmentRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(itemIndex, 1)
    this.inMemoryAnswerAttachmentRepository.deleteManyByAnswerId(
      answer.id.toString(),
    )
  }
}
