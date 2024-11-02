/* eslint-disable prettier/prettier */
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionCommentEvent } from '@/domain/forum/enterprise/events/question-comment-event'

export class OnQuestionComment implements EventHandler {
    constructor(
        private questionCommentsRepository: QuestionCommentsRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(this.sendQuestionCommentNotification.bind(this), QuestionCommentEvent.name)
    }

    private async sendQuestionCommentNotification({ question }: QuestionCommentEvent) {
        const questionComments = await this.questionCommentsRepository.findById(question.id.toString())

        if (questionComments) {
            await this.sendNotification.execute({
                recipientId: questionComments.authorId,
                title: `Sua questão tem um novo comentário`,
                content: questionComments.content.substring(0, 20).concat('...')
            })
        }
    }
}
