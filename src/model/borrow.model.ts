import { ApiProperty } from '@nestjs/swagger';

export class MemberBorrowBooksDto {
  @ApiProperty()
  memberId: string;

  @ApiProperty()
  bookId: string;

  @ApiProperty()
  borrowedAt: Date;

  @ApiProperty()
  hasReturned: number;
}

export class BorrowBookResponse {
  memberName: string;

  bookTitle: string;

  borrowedAt: string;

  hasReturned: number;
}
