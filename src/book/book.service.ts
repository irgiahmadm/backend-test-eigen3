import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { BookResponse, CreateBookDto } from 'src/model/book.model';
import { Logger } from 'winston';
import { BookValidation } from './book.validation';

@Injectable()
export class BookService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(bookDto: CreateBookDto): Promise<BookResponse> {
    try {
      this.logger.info(`Register new user ${JSON.stringify(bookDto)}`);

      const createBook: CreateBookDto = this.validationService.validate(
        BookValidation.CREATE,
        bookDto,
      );

      //check member if exist
      const existBook = await this.prismaService.books.count({
        where: { code: createBook.code },
      });

      if (existBook != 0) {
        throw new HttpException(
          `Book with code ${bookDto.code} already exist`,
          400,
        );
      }

      const data = await this.prismaService.books.create({
        data: createBook,
      });

      const bookResponse: BookResponse = {
        code: data.code,
        title: data.title,
        author: data.author,
        stock: data.stock,
      };
      return bookResponse;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async createBulk(booksDto: CreateBookDto[]): Promise<BookResponse[]> {
    try {
      const bookResponses: BookResponse[] = [];

      for (const bookDto of booksDto) {
        this.logger.info(`Register new book ${JSON.stringify(bookDto)}`);

        const createBook: CreateBookDto = this.validationService.validate(
          BookValidation.CREATE,
          bookDto,
        );

        // Check if book already exists
        const existBook = await this.prismaService.books.count({
          where: { code: createBook.code },
        });

        if (existBook !== 0) {
          throw new HttpException(
            `Book with code ${bookDto.code} already exists`,
            400,
          );
        }

        const data = await this.prismaService.books.create({
          data: createBook,
        });

        const bookResponse: BookResponse = {
          code: data.code,
          title: data.title,
          author: data.author,
          stock: data.stock,
        };

        bookResponses.push(bookResponse);
      }

      return bookResponses;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async fetchAll(): Promise<BookResponse[]> {
    try {
      const data = await this.prismaService.books.findMany({
        where: {
          stock: {
            gt: 0,
          },
        },
      });

      return data;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
