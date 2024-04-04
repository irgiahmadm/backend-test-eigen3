import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseWeb } from 'src/interface/response.interface';
import { LoginUserDto, MemberResponse } from 'src/model/member.model';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @ApiOperation({ summary: 'Login Member' })
  async login(
    @Body() userDto: LoginUserDto,
  ): Promise<ResponseWeb<MemberResponse>> {
    const result = await this.authService.login(userDto);
    const response: ResponseWeb<MemberResponse> = {
      status: 'success',
      statusCode: 200,
      message: 'Success login',
      data: result,
    };

    return response;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
