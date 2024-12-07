/* eslint-disable prettier/prettier */
import { HashComparer } from '@/domain/forum/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(hash: string, plain: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
