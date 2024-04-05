import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { BorrowService } from './borrow.service';
import {
  BorrowBookResponse,
  MemberBorrowBooksDto,
  MemberReturnedBookDto,
} from 'src/model/borrow.model';
import { ResponseWeb } from 'src/interface/response.interface';

@ApiTags('Borrow Books')
@Controller('borrow')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  async borrow(
    @Body() borrowDto: MemberBorrowBooksDto,
  ): Promise<ResponseWeb<BorrowBookResponse>> {
    try {
      const bookResponse = await this.borrowService.borrow(borrowDto);
      const response: ResponseWeb<BorrowBookResponse> = {
        status: 'success',
        statusCode: 200,
        message: 'Success borrow book',
        data: bookResponse,
      };
      return response;
    } catch (error) {
      const response: ResponseWeb<BorrowBookResponse> = {
        status: 'failed',
        statusCode: error.status,
        message: error.message,
        data: null,
      };
      throw response;
    }
  }

  @Post('returned')
  async returned(
    @Body() returnedBookDto: MemberReturnedBookDto,
  ): Promise<ResponseWeb<BorrowBookResponse>> {
    const { data, message } =
      await this.borrowService.returned(returnedBookDto);

    try {
      const response: ResponseWeb<BorrowBookResponse> = {
        status: 'success',
        statusCode: 200,
        message: `Success returned book. ${message ?? ''}`,
        data: data,
      };
      return response;
    } catch (error) {
      const response: ResponseWeb<BorrowBookResponse> = {
        status: 'failed',
        statusCode: error.status,
        message: error.message,
        data: null,
      };
      throw response;
    }
  }
}
