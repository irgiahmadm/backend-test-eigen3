import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'), // Retrieve secret key from environment variable
        signOptions: { expiresIn: '1h' }, // Optionally, configure token expiration
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
