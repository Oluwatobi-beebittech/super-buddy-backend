import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  canvaDesignId?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  notionAccessToken?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  notionBotId?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  notionWorkspaceIcon?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  notionWorkspaceName?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  notionOwner?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  notionWorkspaceId?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  isNotionAccessTokenValid?: boolean | undefined;
}
