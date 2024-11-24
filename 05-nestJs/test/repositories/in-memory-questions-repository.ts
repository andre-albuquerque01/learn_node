/* eslint-disable prettier/prettier */
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionRepository {
    public items: Question[] = []

    constructor(private questionAttachmentRepository: QuestionAttachmentRepository){}

    async findById(id: string) {
        const question = this.items.find(item => item.id.toString() === id)
        if (!question) return null
        return question
    }

    async findBySlug(slug: string) {
        const question = this.items.find(item => item.slug.value === slug)
        if (!question) return null
        return question
    }

    async findManyRecent({ page }: PaginationParams) {
        const questions = this.items
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page - 1) * 20, page * 20)

        return questions
    }

    async create(question: Question) {
        this.items.push(question)
        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async save(question: Question) {
        const itemIndex = this.items.findIndex(item => item.id === question.id)
        this.items[itemIndex] = question
        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async delete(question: Question) {
        const itemIndex = this.items.findIndex(item => item.id === question.id)
        this.items.splice(itemIndex, 1)
        this.questionAttachmentRepository.deleteManyByQuestionId(question.id.toString())
    }
}
