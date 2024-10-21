/* eslint-disable prettier/prettier */
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}
interface ChooseQuestionBestAnswerUseCaseResponse {
  question: Question
}
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository, 
    private questionRepository: QuestionRepository) {}

  async execute({
    answerId,
    authorId
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)
    
    if (!answer) {
      throw new Error('Answer not found')
    }

    const question = await this.questionRepository.findById(answer.questionId.toString())
    
    if (!question) {
      throw new Error('Question not found')
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Unauthorized to choose this answer as best')
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return { question }

  }
}
