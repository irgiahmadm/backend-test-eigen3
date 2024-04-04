import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  BorrowBookResponse,
  MemberBorrowBooksDto,
} from 'src/model/borrow.model';

@Injectable()
export class BorrowService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}
  async borrow(
    borrowBookDto: MemberBorrowBooksDto,
  ): Promise<BorrowBookResponse> {
    const checkAlreadyBorrowing =
      await this.prismaService.memberBorrowBooks.findMany({
        where: {
          AND: [
            { memberId: borrowBookDto.memberId },
            { hasReturned: { equals: 0 } },
          ],
        },
      });

    if (checkAlreadyBorrowing.length > 0) {
      throw new HttpException(
        'Member already borrowed books and still not returned it',
        400,
      );
    }

    const book = await this.prismaService.books.findFirst({
      where: {
        AND: [
          {
            id: borrowBookDto.bookId,
          },
        ],
      },
    });

    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    if (book.stock == 0) {
      throw new HttpException('Book stock is empty', 400);
    }

    const member = await this.prismaService.member.findFirst({
      where: {
        AND: [{ id: borrowBookDto.memberId }],
      },
    });

    if (!member) {
      throw new HttpException('Member not found', 404);
    }

    const currentDate = new Date();
    if (member.penalizedEndDate || member.penalizedEndDate > currentDate) {
      throw new HttpException('Member is being penalized', 400);
    }

    const borrowBooks = await this.prismaService.memberBorrowBooks.create({
      data: borrowBookDto,
    });

    if (borrowBooks.bookId == '') {
      throw new HttpException('Failed to borrow book', 500);
    } else {
      const newStock = book.stock - 1;
      await this.prismaService.books.update({
        where: { id: book.id },
        data: { stock: newStock },
      });
    }

    const borrowBookResponse: BorrowBookResponse = {
      memberName: member.name,
      bookTitle: book.title,
      borrowedAt: currentDate.toISOString(),
      hasReturned: 0,
    };

    return borrowBookResponse;
  }
}
