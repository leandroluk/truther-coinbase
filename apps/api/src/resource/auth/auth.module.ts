import {Module} from '@nestjs/common';
import {AuthModule as NestAuthModule} from '@repo/nest-auth';
import {AuthController} from './auth.controller';

@Module({
  imports: [NestAuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
