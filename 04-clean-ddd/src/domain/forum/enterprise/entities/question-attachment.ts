/* eslint-disable prettier/prettier */
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface QuestionAttachmentProps {
    questionId: UniqueEntityID
    attachment: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
    get questionId() {
        return this.props.questionId
    }

    get attachment() {
        return this.props.attachment
    }

    static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
        const attachment = new QuestionAttachment(props, id)
        return attachment
    }
}
