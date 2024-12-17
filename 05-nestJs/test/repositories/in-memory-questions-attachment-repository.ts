/* eslint-disable prettier/prettier */
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionsAttachmentRepository
  implements QuestionAttachmentRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionAttachment
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachment = (this.items = this.items.filter(
        (item) => {
            return !attachments.some((attachment) => attachment.equals(item))
        }
      ))
      this.items = questionAttachment
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachment = (this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    ))
    this.items = questionAttachment
  }
}
