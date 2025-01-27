// src/utils/utils.module.ts

import { Global, Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule { }