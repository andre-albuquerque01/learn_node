/* eslint-disable prettier/prettier */
export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>
}
