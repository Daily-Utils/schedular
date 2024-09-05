import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'dummytestuser', email: 'dummytestuser@example.com', password: 'dummytestuser' })
      .expect(201);
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'dummytestuser', password: 'dummytestuser' })
      .expect(200);
  });

  it('/auth/protected-route (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/protected-route')
      .expect(401); // Since this route is protected, it should return 401 Unauthorized
  });
});
