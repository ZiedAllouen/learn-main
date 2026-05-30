import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: { findUnique: jest.Mock; create: jest.Mock };
    refreshToken: { create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn(), create: jest.fn() },
      refreshToken: { create: jest.fn().mockResolvedValue({}) },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('signed.jwt') } },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  it('rejects login with unknown email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'x@y.z', password: 'pw' }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects login with wrong password', async () => {
    const hash = await argon2.hash('correct-password');
    prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'x@y.z', role: 'USER', passwordHash: hash });
    await expect(service.login({ email: 'x@y.z', password: 'wrong-password' }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('issues tokens on valid login', async () => {
    const hash = await argon2.hash('correct-password');
    prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'x@y.z', role: 'USER', passwordHash: hash });
    const result = await service.login({ email: 'x@y.z', password: 'correct-password' });
    expect(result.accessToken).toBe('signed.jwt');
    expect(typeof result.refreshToken).toBe('string');
  });

  it('rejects register when email exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1' });
    await expect(service.register({ email: 'x@y.z', password: 'password8' }))
      .rejects.toBeInstanceOf(ConflictException);
  });
});
