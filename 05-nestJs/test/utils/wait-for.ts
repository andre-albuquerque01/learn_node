/* eslint-disable prettier/prettier */
export async function waitFor(
  assertions: () => void,
  maxDuration = 1000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0

    const interval = setInterval(() => {
      elapsedTime += 10

      try {
        assertions()
        clearInterval(interval)
        resolve()
      } catch (err) {
        if (elapsedTime >= maxDuration) {
          reject(new Error('Timeout exceeded'))
        }
      }
    }, 10)
  })
}
