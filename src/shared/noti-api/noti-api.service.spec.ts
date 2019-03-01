import { Test, TestingModule } from '@nestjs/testing';
import { NotiApiService } from './noti-api.service';

describe('NotiApiService', () => {
  let service: NotiApiService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotiApiService],
    }).compile();
    service = module.get<NotiApiService>(NotiApiService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
