import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FetchRecentQuestionsUseCase } from '../../../domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';

const pageQueryParamSchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(pageQueryParamSchema))
    query: PageQueryParam,
  ) {
    const page = query.page;
    const result = await this.fetchRecentQuestions.execute({ page });

    if (result.isLeft()) {
      throw new Error('Could not fetch recent questions');
    }

    const questions = result.value.questions;

    return { questions: questions.map(QuestionPresenter.toHTTP) };
  }
}
