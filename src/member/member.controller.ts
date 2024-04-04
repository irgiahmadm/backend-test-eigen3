import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateUserDto, MemberResponse } from 'src/model/member.model';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseWeb } from 'src/interface/response.interface';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Member')
@Controller('v1/member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create Member' })
  async register(
    @Body() userDto: CreateUserDto,
  ): Promise<ResponseWeb<MemberResponse>> {
    const result = await this.memberService.register(userDto);
    const response: ResponseWeb<MemberResponse> = {
      status: 'success',
      statusCode: 200,
      message: 'Success retrieve member data',
      data: result,
    };

    return response;
  }

  @Post('bulk-register')
  async registerBulk(
    @Body() usersDto: CreateUserDto[],
  ): Promise<ResponseWeb<MemberResponse[]>> {
    const result = await this.memberService.bulkRegister(usersDto);
    const response: ResponseWeb<MemberResponse[]> = {
      status: 'success',
      statusCode: 200,
      message: 'Success retrieve member data',
      data: result,
    };

    return response;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  async fetchAll(): Promise<ResponseWeb<MemberResponse[]>> {
    const memberResponse = await this.memberService.fetchAll();
    const response: ResponseWeb<MemberResponse[]> = {
      status: 'success',
      statusCode: 200,
      message: 'Success get list of members',
      data: memberResponse,
    };
    return response;
  }
}
