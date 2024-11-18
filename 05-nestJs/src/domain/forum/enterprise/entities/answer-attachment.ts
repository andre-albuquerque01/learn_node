/* eslint-disable prettier/prettier */
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AnswerAttachmentProps {
    answerId: UniqueEntityID
    attachment: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
    get answerId() {
        return this.props.answerId
    }

    get attachment() {
        return this.props.attachment
    }

    static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
        const attachment = new AnswerAttachment(props, id)
        return attachment
    }
}
