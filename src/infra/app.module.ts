import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { CreateQuestionController } from '../controllers/create-question.controller';
import { FetchRecentQuestionsController } from '../controllers/fetch-recent-questions.controller';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './http/controllers/authenticate-controller';
import { CreateAccountController } from './http/controllers/create-account.controller';

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
