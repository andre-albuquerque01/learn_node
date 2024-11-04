/* eslint-disable prettier/prettier */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { QuestionComment } from '../entities/question-comments'

export class QuestionCommentEvent implements DomainEvent {
  public ocurredAt: Date
  public question: QuestionComment

  constructor(question: QuestionComment) {
    this.ocurredAt = new Date()
    this.question = question
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
