import { Injectable } from '@nestjs/common';
import type { Encrypter } from '../../domain/forum/application/cryptography/encrypter';
import type { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
