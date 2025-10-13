import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@gmail.com',
        password: await hash('password', 6),
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: 'Test Question 1',
          slug: 'test-question-1',
          content: 'this is a test question',
          authorId: user.id,
        },
        {
          title: 'Test Question 2',
          slug: 'test-question-2',
          content: 'this is a test question',
          authorId: user.id,
        },
        {
          title: 'Test Question 3',
          slug: 'test-question-3',
          content: 'this is a test question',
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .query({
        page: 1,
      })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      questions: expect.any(Array),
    });
  });
});
