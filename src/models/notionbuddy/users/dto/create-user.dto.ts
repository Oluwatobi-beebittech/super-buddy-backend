import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  canvaUserId: string;

  @IsNotEmpty()
  canvaBrandId: string;
}
