import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  penalizedEndDate?: string;
}

export class LoginUserDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  password: string;
}

export class MemberResponse {
  id?: string;
  code: string;
  name: string;
  penalizedEndDate?: string;
  token?: string;
}
