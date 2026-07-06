// src/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CodeProcessor } from './code.processor';
import { AppService } from './app.service'; 

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService, // 👈 แอด Service จริงเข้าไปร่วมด้วย
        {
          provide: CodeProcessor,
          useValue: {
            getProblems: jest.fn().mockReturnValue([{ id: 'sum-01', title: 'Test Problem' }]),
            getSubmissions: jest.fn().mockReturnValue([]),
            process: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // บล็อกการทดสอบหลัก (ห้ามหายเด็ดขาด)
  describe('getProblems', () => {
    it('should return problems list', () => {
      expect(appController.getProblems()).toEqual([{ id: 'sum-01', title: 'Test Problem' }]);
    });
  });
});