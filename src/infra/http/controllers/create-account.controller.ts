import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { PrismaService } from '../../database/prisma/prisma.service';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    const hashedPassword = await hash(password, 10);

    if (userWithSameEmail) {
      throw new ConflictException('Email already exists');
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
