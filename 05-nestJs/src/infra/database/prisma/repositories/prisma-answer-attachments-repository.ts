/* eslint-disable prettier/prettier */
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentRepository {
    constructor(private prisma: PrismaService) {}

    async findManyByAnswerId(
      answerId: string,
    ): Promise<AnswerAttachment[]> {
      const answerAttachment = await this.prisma.attachment.findMany({
        where: {
          answerId,
        },
      })
  
      return answerAttachment.map(PrismaAnswerAttachmentMapper.toDomain)
    }
  
    async deleteManyByAnswerId(answerId: string): Promise<void> {
      await this.prisma.attachment.deleteMany({
        where: {
          answerId,
        },
      })
    }

    async createMany(attachments: AnswerAttachment[]): Promise<void> {
      if (attachments.length === 0) return
      
      const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)
      
      await this.prisma.attachment.updateMany(data)
    }
    
    async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
      if (attachments.length === 0) return
  
      const attachmentIds = attachments.map((attachment) => {
        return attachment.id.toString()
      })
  
      await this.prisma.attachment.deleteMany({
        where: {
          id: { in: attachmentIds },
        },
      })
    }
}
