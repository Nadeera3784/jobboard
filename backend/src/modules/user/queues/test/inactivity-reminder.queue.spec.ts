import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../../../app/services';
import { InactivityReminderQueue } from '../inactivity-reminder.queue';
import { getQueueToken } from '@nestjs/bull';
import { mockBullQueue } from './jest-mocks';

describe('queues/Inactivityreminderqueue', () => {
  let emailService: EmailService;
  let inactivityReminderQueue: InactivityReminderQueue;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'mail.resend.key') {
                return 123;
              }
              return null;
            }),
          },
        },
        InactivityReminderQueue,
        {
          provide: getQueueToken('inactivity-reminder-email'),
          useValue: mockBullQueue,
        },
      ],
    }).compile();
    emailService = module.get<EmailService>(EmailService);
    inactivityReminderQueue = module.get<InactivityReminderQueue>(
      InactivityReminderQueue,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(inactivityReminderQueue).toBeDefined();
  });

  it('should add reminde email to bull queue success', async () => {
    const errorMsg = 'Failed to add to queue';
    jest.spyOn(emailService, 'sendAccountInactivityReminderEmail')
      .mockReturnThis;
    mockBullQueue.add.mockRejectedValueOnce(new Error(errorMsg));
  });
});
