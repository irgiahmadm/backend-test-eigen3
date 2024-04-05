import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { MemberBorrowBooks } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  BorrowBookResponse,
  MemberBorrowBooksDto,
  MemberReturnedBookDto,
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
    try {
      const checkBorrowedBooks =
        await this.prismaService.memberBorrowBooks.findMany({
          where: {
            AND: [
              { memberId: borrowBookDto.memberId },
              { returnedAt: { not: null } },
            ],
          },
        });

      if (checkBorrowedBooks.length > 0) {
        throw new HttpException(
          'Member can not borrow more than 2 books.',
          400,
        );
      }

      const checkAlreadyBorrowing =
        await this.prismaService.memberBorrowBooks.findMany({
          where: {
            AND: [
              { memberId: borrowBookDto.memberId },
              { bookId: borrowBookDto.bookId },
              { returnedAt: null },
            ],
          },
        });

      if (checkAlreadyBorrowing.length > 0) {
        throw new HttpException('Member is still borrow this book', 400);
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
      if (member.penalizedEndDate > currentDate) {
        throw new HttpException('Member is being penalized', 400);
      }

      const memberBooks: MemberBorrowBooks = {
        bookId: borrowBookDto.bookId,
        memberId: borrowBookDto.memberId,
        borrowedAt: new Date(borrowBookDto.borrowedAt),
        returnedAt: null,
      };

      console.log(memberBooks);
      const borrowBooks = await this.prismaService.memberBorrowBooks.create({
        data: memberBooks,
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
        borrowedAt: borrowBookDto.borrowedAt,
        returnedAt: null,
      };

      return borrowBookResponse;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async returned(
    returnedBookDto: MemberReturnedBookDto,
  ): Promise<{ data: BorrowBookResponse; message: string }> {
    try {
      let returnMessage = '';

      const currentDate = new Date();
      const borrowedBookExist =
        await this.prismaService.memberBorrowBooks.findFirst({
          where: {
            AND: [
              { memberId: returnedBookDto.memberId },
              { bookId: returnedBookDto.bookId },
            ],
          },
        });

      if (!borrowedBookExist) {
        throw new HttpException('Member not borrowing selected book', 400);
      }

      const borrowingDate = borrowedBookExist.borrowedAt;
      const returnedAtDate = new Date(returnedBookDto.returnedAt);
      if (isNaN(returnedAtDate.getTime())) {
        throw new HttpException('Invalid returnedAt date', 400);
      }
      const borrowedTimes = returnedAtDate.getTime() - borrowingDate.getTime();

      const daysDifference = Math.floor(borrowedTimes / (1000 * 3600 * 24));

      const book = await this.prismaService.books.findFirst({
        where: {
          AND: [
            {
              id: returnedBookDto.bookId,
            },
          ],
        },
      });

      if (!book) {
        throw new HttpException('Book not found', 404);
      }

      const member = await this.prismaService.member.findFirst({
        where: {
          AND: [{ id: returnedBookDto.memberId }],
        },
      });

      if (!member) {
        throw new HttpException('Member not found', 404);
      }

      const penalizedEndDate = new Date(currentDate);
      if (daysDifference > 7) {
        returnMessage = 'Member is being penalized, borrowing more than 7 days';

        //penalized for 3 days
        penalizedEndDate.setDate(currentDate.getDate() + 3);
        //update penalizedEnDate
        await this.prismaService.member.update({
          where: {
            id: member.id,
          },
          data: { penalizedEndDate: penalizedEndDate },
        });
      }

      //update book stock
      const newStock = book.stock + 1;
      await this.prismaService.books.update({
        where: { id: book.id },
        data: { stock: newStock },
      });

      //update has returned
      await this.prismaService.memberBorrowBooks.update({
        where: { id: borrowedBookExist.id },
        data: { returnedAt: currentDate },
      });

      const borrowBookResponse: BorrowBookResponse = {
        memberName: member.name,
        bookTitle: book.title,
        borrowedAt: borrowedBookExist.borrowedAt.toISOString(),
        returnedAt: returnedAtDate.toISOString(),
      };
      return { data: borrowBookResponse, message: returnMessage };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
