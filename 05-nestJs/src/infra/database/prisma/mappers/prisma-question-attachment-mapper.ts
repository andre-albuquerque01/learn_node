/* eslint-disable prettier/prettier */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.')
    }

    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityID(raw.questionId),
        attachment: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachment.toString()
    })

    return {
      where: {
        id: { in: attachmentIds },
      },
      data: {
        questionId: attachments[0].questionId.toString(),
      },
    }
  }
}
