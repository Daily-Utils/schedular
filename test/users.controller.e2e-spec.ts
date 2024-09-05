import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/modules/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/users/schemas/user.entity';

describe('UsersController (e2e)', () => {
    let app: INestApplication;

    const mockUsers = [{ id: 1, username: 'John', email: "john@example.com" }];
    const mockUsersRepository = {
        find: jest.fn().mockResolvedValue(mockUsers),
    };
    let authToken: string; // Variable to hold the authentication token

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
        })
            .overrideProvider(getRepositoryToken(User))
            .useValue(mockUsersRepository)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        authToken = await performAuthentication();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/users (GET)', async () => {
        return request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)
            .expect(mockUsers)
            .expect('Content-Type', /json/);
    });

    it('/users/dummy (GET)', async () => {
        return request(app.getHttpServer())
            .get('/users/dummy')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)
            .expect('Content-Type', /json/);
    });


    async function performAuthentication(): Promise<string> {
        // Assuming your authentication endpoint is '/auth/login'
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'dummytestuser', password: 'dummytestuser' });

        // Extract the authentication token from the response body
        const authToken = response.body.access_token;

        return authToken;
    }
});



