/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })
    if (!question) {
      return null
    }
    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findFirst({
      where: {
        slug,
      },
    })
    if (!question) {
      return null
    }
    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const question = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return question.map(PrismaQuestionMapper.toDomain)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.create({ data })
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.delete({
      where: {
        id: data.id,
      }
    })
  }
}
