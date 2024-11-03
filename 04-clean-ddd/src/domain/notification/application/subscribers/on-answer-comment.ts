/* eslint-disable prettier/prettier */
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerCommentEvent } from '@/domain/forum/enterprise/events/answer-comment-event'

export class OnAnswerComment implements EventHandler {
    constructor(
        private answerCommentsRepository: AnswerCommentsRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(this.sendAnswerCommentNotification.bind(this), AnswerCommentEvent.name)
    }

    private async sendAnswerCommentNotification({ answer }: AnswerCommentEvent) {
        const answerComments = await this.answerCommentsRepository.findById(answer.id.toString())

        if (answerComments) {
            await this.sendNotification.execute({
                recipientId: answerComments.authorId,
                title: `Sua resposta tem um novo comentário`,
                content: answerComments.content.substring(0, 20).concat('...')
            })
        }
    }
}
