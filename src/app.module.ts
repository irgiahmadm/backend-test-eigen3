import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { MemberController } from './member/member.controller';
import { MemberModule } from './member/member.module';
import { BookController } from './book/book.controller';
import { CommonModule } from './common/common.module';

@Module({
  imports: [BookModule, MemberModule, CommonModule],
  controllers: [MemberController, BookController],
  providers: [],
})
export class AppModule {}
