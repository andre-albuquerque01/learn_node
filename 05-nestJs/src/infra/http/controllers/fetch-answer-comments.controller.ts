/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CommentPresenter } from '../presenters/comment-presenter'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/user-cases/fetch-answer-comment'

const pageQueryParmasSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParmasSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParmasSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerCommentsUseCase.execute({
      answerId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answerComment = result.value.answerComment

    return { comments: answerComment.map(CommentPresenter.toHTTP) }
  }
}
