import { Test, TestingModule } from '@nestjs/testing';
import { CleanExpireJobService } from './clean-expire.job.service';

describe('CleanExpireJobService', () => {
  let service: CleanExpireJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleanExpireJobService],
    }).compile();

    service = module.get<CleanExpireJobService>(CleanExpireJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
