import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { BorrowModule } from './borrow/borrow.module';

@Module({
  imports: [CommonModule, AuthModule, MemberModule, BookModule, BorrowModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
