/* eslint-disable prettier/prettier */
import { UseCaseError } from '@/core/errors/use-case-error'

export class NotAllowError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed')
  }
}
