import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AppController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const auth: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = auth.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should return "HHello Notion buddy"', () => {
      expect(authController.getHello()).toBe('Hello Notion buddy');
    });
  });
});
