/* eslint-disable prettier/prettier */
import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, string>{
    if (shouldSuccess) {
        return right('Success')
    } else {
        return left('Failure')
    }
}

test('sucess result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('failure result', () => {
    const result = doSomething(false)
    
    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
})
