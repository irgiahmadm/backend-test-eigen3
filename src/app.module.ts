import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MemberController } from './member/member.controller';
import { MemberModule } from './member/member.module';

@Module({
  imports: [BookModule, MemberModule],
  controllers: [AppController, MemberController],
  providers: [AppService],
})
export class AppModule {}
