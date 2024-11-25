/* eslint-disable prettier/prettier */
export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
