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
        const answer = new Answer({
            content,
            authorId: instructorId,
            questionId
        })

        await this.answerRepository.create(answer)

        return answer
    }
}