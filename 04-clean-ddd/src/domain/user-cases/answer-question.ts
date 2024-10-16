import { UniqueEntityID } from "../core/entities/unique-entity-id"
import { Answer } from "../entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface AnswerQuestionUseCaseRequest {
    questionId: string
    instructorId: string
    content: string
}

export class AnswerQuestionUseCase {

    constructor(
        private answerRepository: AnswersRepository 
    ){}

    async execute({ questionId, instructorId, content }: AnswerQuestionUseCaseRequest) {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityID(instructorId),
            questionId: new UniqueEntityID(questionId)
        })

        await this.answerRepository.create(answer)

        return answer
    }
}