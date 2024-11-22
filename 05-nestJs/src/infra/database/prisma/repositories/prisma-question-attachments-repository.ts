/* eslint-disable prettier/prettier */
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentRepository {
    findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        throw new Error('Method not implemented.')
    }

    deleteManyByQuestionId(questionId: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

}
