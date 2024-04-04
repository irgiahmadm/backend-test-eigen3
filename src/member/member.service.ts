import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { CreateUserDto, MemberResponse } from 'src/model/member.model';
import { Logger } from 'winston';
import { MemberValidation } from './member.validation';
import * as bcrypt from 'bcrypt';
@Injectable()
export class MemberService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(userDto: CreateUserDto): Promise<MemberResponse> {
    try {
      this.logger.info(`Register new user ${JSON.stringify(userDto)}`);

      const createMember: CreateUserDto = this.validationService.validate(
        MemberValidation.REGISTER,
        userDto,
      );

      //check member if exist
      const existMember = await this.prismaService.member.count({
        where: { code: createMember.code },
      });

      if (existMember != 0) {
        throw new HttpException('User already exist', 400);
      }

      createMember.password = await bcrypt.hash(createMember.password, 10);

      const data = await this.prismaService.member.create({
        data: createMember,
      });

      const userResponse: MemberResponse = {
        code: data.code,
        name: data.name,
      };
      return userResponse;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async bulkRegister(usersDto: CreateUserDto[]): Promise<MemberResponse[]> {
    try {
      const userResponses: MemberResponse[] = [];

      for (const userDto of usersDto) {
        this.logger.info(`Register new bulk user ${JSON.stringify(userDto)}`);

        const createMember: CreateUserDto = this.validationService.validate(
          MemberValidation.REGISTER,
          userDto,
        );

        // Check if member already exists
        const existMember = await this.prismaService.member.count({
          where: { code: createMember.code },
        });

        if (existMember !== 0) {
          throw new HttpException('User already exists', 400);
        }

        createMember.password = await bcrypt.hash(createMember.password, 10);

        const data = await this.prismaService.member.create({
          data: createMember,
        });

        const userResponse: MemberResponse = {
          code: data.code,
          name: data.name,
        };

        userResponses.push(userResponse);
      }

      return userResponses;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async fetchAll(): Promise<MemberResponse[]> {
    try {
      const data = await this.prismaService.member.findMany();
      const memberResponses: MemberResponse[] = data.map((member) => ({
        id: member.id,
        code: member.code,
        name: member.name,
        penalizedEndDate: member.penalizedEndDate?.toString(),
      }));

      return memberResponses;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
