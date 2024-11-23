/* eslint-disable prettier/prettier */
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionsAttachmentRepository implements QuestionAttachmentRepository {
    public items: QuestionAttachment[] = []
    
    async findManyByQuestionId(questionId: string) {
        const questionAttachment = this.items
        .filter(item => item.questionId.toString() === questionId)
        
        return questionAttachment
    }
    
    async deleteManyByQuestionId(questionId: string) {
        const questionAttachment = this.items = this.items.filter(item => item.questionId.toString() !== questionId)
        this.items = questionAttachment 
    }
}
