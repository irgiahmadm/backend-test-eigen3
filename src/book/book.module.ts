import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [BookController],
  providers: [BookService],
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
})
export class BookModule {}
