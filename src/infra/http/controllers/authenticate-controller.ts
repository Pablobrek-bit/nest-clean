import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { JwtService } from '@nestjs/jwt';
import type { PrismaService } from '../../prisma/prisma.service';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type AuthenticateBodySchemaBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(authenticateBodySchema))
    body: AuthenticateBodySchemaBodySchema,
  ) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const doesPasswordMatches = await compare(password, user.password);

    if (!doesPasswordMatches) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const accessToken = this.jwt.sign({ sub: user.id });
    return { accessToken };
  }
}
