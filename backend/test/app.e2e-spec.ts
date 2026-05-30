import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health → 200 ok', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => { expect(res.body.status).toBe('ok'); });
  });

  it('GET /api/sectors → 200 array (public)', () => {
    return request(app.getHttpServer())
      .get('/api/sectors')
      .expect(200)
      .expect((res) => { expect(Array.isArray(res.body)).toBe(true); });
  });

  it('POST /api/sectors without auth → 401', () => {
    return request(app.getHttpServer())
      .post('/api/sectors')
      .send({ slug: 'x', name: 'X', color: '#000' })
      .expect(401);
  });
});
