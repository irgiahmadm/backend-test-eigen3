import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { MemberValidation } from 'src/member/member.validation';
import { LoginUserDto, MemberResponse } from 'src/model/member.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<MemberResponse> {
    try {
      this.logger;

      const loginMember: LoginUserDto = this.validationService.validate(
        MemberValidation.LOGIN,
        loginDto,
      );

      const member = await this.prismaService.member.findFirst({
        where: { code: loginMember.code },
      });

      if (!member) {
        throw new HttpException('User code or password is invalid', 401);
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        member.password,
      );

      if (!isPasswordValid) {
        throw new HttpException('User code or password is invalid.', 401);
      }

      const userResponse: MemberResponse = {
        id: member.id,
        code: member.code,
        name: member.name,
      };

      userResponse.token = await this.jwtService.signAsync(userResponse);

      return userResponse;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
