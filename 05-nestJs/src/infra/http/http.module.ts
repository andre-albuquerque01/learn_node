/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '@faker-js/faker/.'
import { CreateQuestionUseCase } from '@/domain/forum/application/user-cases/create-question'
import { FetchRecentQuestionUseCase } from '@/domain/forum/application/user-cases/fecth-recent-questions'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase, FetchRecentQuestionUseCase],
})
export class HttpModule {}
