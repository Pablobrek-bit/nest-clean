import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import request from 'supertest';
import { response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcryptjs';

describe('Create account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    });

    const userOnDB = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    expect(userOnDB).toBeDefined();
    expect(response.status).toBe(201);
  });

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@gmail.com',
        password: await hash('password', 6),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'test@gmail.com',
      password: 'password',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
  });
});
