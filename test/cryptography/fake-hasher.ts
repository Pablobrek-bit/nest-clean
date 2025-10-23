import type { HashComparer } from '../../src/domain/forum/application/cryptography/hasher-comparer';
import type { HashGenerator } from '../../src/domain/forum/application/cryptography/hasher-generator';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return `hashed-${plain}`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return plain === hashed.replace('hashed-', '');
  }
}
