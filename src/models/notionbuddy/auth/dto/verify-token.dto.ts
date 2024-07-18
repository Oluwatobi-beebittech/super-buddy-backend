import { IsNotEmpty } from 'class-validator';

import { CreateUserDto } from '../../users/dto/create-user.dto';

export class VerifyUserTokenDto extends CreateUserDto {
  @IsNotEmpty()
  isUserTokenVerified: boolean;
}

export class VerifyDesignTokenDto {
  @IsNotEmpty()
  designId: string;

  @IsNotEmpty()
  isDesignTokenVerified: boolean;
}
