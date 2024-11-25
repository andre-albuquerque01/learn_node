/* eslint-disable prettier/prettier */
export abstract class HashComparer {
  abstract compare(hash: string, plain: string): Promise<boolean>
}
