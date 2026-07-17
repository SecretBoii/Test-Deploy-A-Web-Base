import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CodeProcessor } from './code.processor';
import { AppService } from './app.service'; 
import { AuthService } from './auth/auth.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: CodeProcessor,
          useValue: {
            getProblems: jest.fn().mockReturnValue([{ id: 'sum-01', title: 'Test Problem' }]),
            getSubmissions: jest.fn().mockReturnValue([]),
            process: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getProblems', () => {
    it('should return problems list', () => {
      expect(appController.getProblems()).toEqual([{ id: 'sum-01', title: 'Test Problem' }]);
    });
  });
});