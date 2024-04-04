import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { BorrowService } from './borrow.service';
import {
  BorrowBookResponse,
  MemberBorrowBooksDto,
} from 'src/model/borrow.model';
import { ResponseWeb } from 'src/interface/response.interface';

@ApiTags('Borrow Books')
@Controller('borrow')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  async create(
    @Body() borrowDto: MemberBorrowBooksDto,
  ): Promise<ResponseWeb<BorrowBookResponse>> {
    const bookResponse = await this.borrowService.borrow(borrowDto);
    const response: ResponseWeb<BorrowBookResponse> = {
      status: 'success',
      statusCode: 200,
      message: 'Success borrow book',
      data: bookResponse,
    };
    return response;
  }
}
