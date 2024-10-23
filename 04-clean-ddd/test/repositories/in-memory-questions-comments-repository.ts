/* eslint-disable prettier/prettier */
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments'

export class InMemoryQuestionsCommentsRepository implements QuestionCommentsRepository {
    public items: QuestionComment[] = []

    async findById(id: string) {
        const questionComments = this.items.find(item => item.id.toString() === id)
        if (!questionComments) return null
        return questionComments
    }
    
    async create(questionComments: QuestionComment) {
        this.items.push(questionComments)
    }

    async delete(questionComments: QuestionComment) {
        const itemIndex = this.items.findIndex(item => item.id === questionComments.id)
        this.items.splice(itemIndex, 1)
    }
}
