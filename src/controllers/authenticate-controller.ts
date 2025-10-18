import {
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { compare, hash } from 'bcryptjs';
import z from 'zod';
import { ZodValidationPipe } from '../infra/pipes/zod-validation-pipe';
import { JwtService } from '@nestjs/jwt';

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
