import { Module, Global,  HttpModule } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategyService } from './auth/strategies/jwt-strategy.service';
import { UserModule } from 'src/user/user.module';
import { NotiApiService } from './noti-api/noti-api.service';

@Global()
@Module({
  providers: [ConfigurationService, MapperService, AuthService, JwtStrategyService, NotiApiService,],
  exports: [ConfigurationService, MapperService, AuthService, NotiApiService],
  imports: [UserModule, HttpModule]
})
export class SharedModule {}
