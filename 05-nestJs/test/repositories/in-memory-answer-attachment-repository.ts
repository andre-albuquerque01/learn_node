/* eslint-disable prettier/prettier */
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswersAttachmentRepository implements AnswerAttachmentRepository {
    public items: AnswerAttachment[] = []
    
    async findManyByAnswerId(answerId: string) {
        const answerAttachment = this.items
        .filter(item => item.answerId.toString() === answerId)
        
        return answerAttachment
    }
    
    async deleteManyByAnswerId(answerId: string) {
        const answerAttachment = this.items = this.items.filter(item => item.answerId.toString() !== answerId)
        this.items = answerAttachment 
    }
}
