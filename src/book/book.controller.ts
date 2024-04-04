import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateBookDto, BookResponse } from 'src/model/book.model';
import { BookService } from './book.service';
import { ResponseWeb } from 'src/interface/response.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Books')
@Controller('book')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(
    @Body() bookDto: CreateBookDto,
  ): Promise<ResponseWeb<BookResponse>> {
    const bookResponse = await this.bookService.create(bookDto);
    const response: ResponseWeb<BookResponse> = {
      status: 'success',
      statusCode: 200,
      message: 'Success retrieve book data',
      data: bookResponse,
    };
    return response;
  }

  @Post('create-bulk')
  async createBulk(
    @Body() booksDto: CreateBookDto[],
  ): Promise<ResponseWeb<BookResponse[]>> {
    const bookResponse = await this.bookService.createBulk(booksDto);
    const response: ResponseWeb<BookResponse[]> = {
      status: 'success',
      statusCode: 200,
      message: 'Success retrieve bulk book data',
      data: bookResponse,
    };
    return response;
  }

  @Get()
  async fetchAll(): Promise<ResponseWeb<BookResponse[]>> {
    const bookResponse = await this.bookService.fetchAll();
    const response: ResponseWeb<BookResponse[]> = {
      status: 'success',
      statusCode: 200,
      message: 'Success get list of books',
      data: bookResponse,
    };
    return response;
  }
}
