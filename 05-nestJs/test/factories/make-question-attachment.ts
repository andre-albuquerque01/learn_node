/* eslint-disable prettier/prettier */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment, QuestionAttachmentProps } from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(override: Partial<QuestionAttachmentProps> = {},
    id?: UniqueEntityID,
) {
    const questionattachment = QuestionAttachment.create({
        attachment: new UniqueEntityID(),
        questionId: new UniqueEntityID(),
        ...override
    },
        id
    )

    return questionattachment
}
