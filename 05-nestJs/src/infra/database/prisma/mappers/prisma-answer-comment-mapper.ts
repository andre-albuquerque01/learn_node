/* eslint-disable prettier/prettier */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if(!raw.answerId){
        throw new Error("Invalid comment type.");
    }

    return AnswerComment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(answercomment: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: answercomment.id.toString(),
      authorId: answercomment.authorId.toString(),
      answerId: answercomment.answerId.toString(),
      content: answercomment.content,
      createdAt: answercomment.createdAt,
      updatedAt: answercomment.updatedAt,
    }
  }
}
