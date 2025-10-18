import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import z from 'zod';
import { CurrentUser } from '../infra/auth/current-user-decorator';
import { JwtAuthGuard } from '../infra/auth/jwt-auth.guard';
import { TokenPayload } from '../infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../infra/http/pipes/zod-validation-pipe';
import { PrismaService } from '../infra/database/prisma/prisma.service';

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
