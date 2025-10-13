import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import type { TokenPayload } from '../auth/jwt.strategy';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBody,
    @CurrentUser() user: TokenPayload,
  ) {
    const { content, title } = body;
    const userId = user.sub;

    const slug = this.createSlug(title);

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    });
    return 'ok';
  }

  private createSlug(title: string): string {
    if (!title) return 'untitled';

    const slug = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');

    return slug || 'untitled';
  }
}
