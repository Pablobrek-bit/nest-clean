import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import z from 'zod';
import { JwtAuthGuard } from '../infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '../infra/http/pipes/zod-validation-pipe';
import { PrismaService } from '../infra/prisma/prisma.service';

const pageQueryParamSchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(pageQueryParamSchema))
    query: PageQueryParam,
  ) {
    const page = query.page;
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return { questions };
  }
}
