import { compare, hash } from 'bcryptjs';
import { HashComparer } from '../../domain/forum/application/cryptography/hasher-comparer';
import { HashGenerator } from '../../domain/forum/application/cryptography/hasher-generator';

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return await compare(plain, hashed);
  }
}
