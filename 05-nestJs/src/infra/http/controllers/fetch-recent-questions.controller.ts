/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionUseCase } from '@/domain/forum/application/user-cases/fecth-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParmasSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParmasSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParmasSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({page})

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value.questions

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
