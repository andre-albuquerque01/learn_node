/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryQuestionsCommentsRepository implements QuestionCommentsRepository {
    public items: QuestionComment[] = []

    constructor(
        private studentsRepository: InMemoryStudentRepository
    ){}

    async findById(id: string) {
        const questionComments = this.items.find(item => item.id.toString() === id)
        if (!questionComments) return null
        return questionComments
    }

    async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
        const questionComment = this.items
            .filter(item => item.questionId.toString() === questionId)
            .slice((page - 1) * 20, page * 20)

        return questionComment
    }

    async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams) {
        const questionComment = this.items
            .filter(item => item.questionId.toString() === questionId)
            .slice((page - 1) * 20, page * 20)
            .map(comment => {
                const author = this.studentsRepository.items.find(student => {
                    return student.id.equals(comment.authorId)
                })

                if(!author){
                    throw new Error(`Student with id ${comment.authorId} not found`)
                }

                return  CommentWithAuthor.create({
                    commentId: comment.id,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                    authorId: comment.authorId ,
                    author: author.name
                })
            })

        return questionComment
    }

    async create(questionComments: QuestionComment) {
        this.items.push(questionComments)
    }

    async delete(questionComments: QuestionComment) {
        const itemIndex = this.items.findIndex(item => item.id === questionComments.id)
        this.items.splice(itemIndex, 1)
    }
}
