import { ApiProperty } from '@nestjs/swagger';

export class MemberBorrowBooksDto {
  @ApiProperty()
  memberId: string;

  @ApiProperty()
  bookId: string;

  @ApiProperty()
  borrowedAt: string;
}

export class MemberReturnedBookDto {
  @ApiProperty()
  memberId: string;

  @ApiProperty()
  bookId: string;

  @ApiProperty()
  returnedAt: string;
}

export class BorrowBookResponse {
  memberName: string;

  bookTitle: string;

  borrowedAt: string;

  returnedAt: string;
}
