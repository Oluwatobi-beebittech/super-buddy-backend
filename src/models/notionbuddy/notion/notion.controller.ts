import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { CustomErrorCode } from 'src/utilities';

import { NotionService } from './notion.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Controller({
  version: '1',
  path: 'notionbuddy/notion',
})
export class NotionController {
  constructor(
    private readonly authService: AuthService,
    private readonly notionService: NotionService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/verify')
  async verifyNotionAccessToken(
    @Body('userId') suppliedUserId,
    @Request() request,
    @Res() res,
  ) {
    const [, userToken] = request.headers.authorization?.split(' ');

    const { isUserTokenVerified, canvaUserId } =
      await this.authService.authoriseUser(userToken);

    if (!isUserTokenVerified) {
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        internalStatusCode: `verify-${CustomErrorCode.USER_TOKEN_VERIFIED}`,
      });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      canvaUserId,
    });

    if (!isRegisteredUser) {
      return res.status(401).json({
        message:
          'User is unauthorised to access this resource. Navigate to connect to notion',
        internalStatusCode: `verify-${CustomErrorCode.NOT_REGISTERED_USER}`,
      });
    }

    const { userId, notionAccessToken } =
      await this.usersService.getRegisteredUser({
        canvaUserId,
        userId: suppliedUserId,
      });

    if (!Boolean(notionAccessToken)) {
      return res.status(401).json({
        message:
          'User has no notion access token unauthorised to access this resource. Navigate to connect to notion',
        internalStatusCode: `verify-${CustomErrorCode.NO_NOTION_ACCESS_TOKEN}`,
      });
    }

    const { isNotionAccessTokenValid } =
      await this.notionService.verify(notionAccessToken);

    await this.usersService.update(userId, {
      isNotionAccessTokenValid,
    });

    if (!isNotionAccessTokenValid) {
      return res.status(401).json({
        message: 'Unauthorise notion token. Reconnect again',
        internalStatusCode: `verify-${CustomErrorCode.ACCESS_TOKEN_VALIDITY}`,
      });
    }

    return res.status(200).json({
      message: 'Verified Notion access token',
      isNotionAccessTokenValid,
    });
  }

  @Post('/pages')
  async getAllPages(
    @Body('userId') suppliedUserId,
    @Request() request,
    @Res() res,
  ) {
    const [, userToken] = request.headers.authorization?.split(' ');

    const { isUserTokenVerified, canvaUserId } =
      await this.authService.authoriseUser(userToken);

    if (!isUserTokenVerified) {
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        internalStatusCode: `pages-${CustomErrorCode.USER_TOKEN_VERIFIED}`,
      });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      canvaUserId,
    });
    if (!isRegisteredUser) {
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        internalStatusCode: `pages-${CustomErrorCode.NOT_REGISTERED_USER}`,
      });
    }

    const { notionAccessToken } = await this.usersService.getRegisteredUser({
      canvaUserId,
      userId: suppliedUserId,
    });

    const result = await this.notionService.getAllPages(notionAccessToken);

    return res.status(200).json(result);
  }

  @Get('/page/:id')
  async getPageContent(
    @Param('id') id: string,
    @Request() request,
    @Res() res,
  ) {
    const [, userToken] = request.headers.authorization?.split(' ');

    const { isUserTokenVerified, canvaUserId } =
      await this.authService.authoriseUser(userToken);

    if (!isUserTokenVerified) {
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        internalStatusCode: `page-id-${CustomErrorCode.USER_TOKEN_VERIFIED}`,
      });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      canvaUserId,
    });
    if (!isRegisteredUser) {
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        internalStatusCode: `page-id-${CustomErrorCode.NOT_REGISTERED_USER}`,
      });
    }

    const { notionAccessToken, isNotionAccessTokenValid } =
      await this.usersService.getRegisteredUser({
        canvaUserId,
      });

    if (!isNotionAccessTokenValid) {
      return res.status(401).json({
        message: 'Unauthorise notion token. Reconnect again',
        internalStatusCode: `page-id-${CustomErrorCode.ACCESS_TOKEN_VALIDITY}`,
      });
    }

    const response = await this.notionService.getPageBlocks(
      notionAccessToken,
      id,
    );

    return res.status(200).json(response);
  }

  @Delete('/disconnect/:id')
  async disconnectFromNotion(
    @Param('id') userId: string,
    @Request() request,
    @Res() res,
  ) {
    const [, userToken] = request.headers.authorization?.split(' ');

    const { isUserTokenVerified, canvaUserId } =
      await this.authService.authoriseUser(userToken);

    if (!isUserTokenVerified) {
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        internalStatusCode: `disconnect-${CustomErrorCode.USER_TOKEN_VERIFIED}`,
      });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      userId,
      canvaUserId,
    });
    if (!isRegisteredUser) {
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        internalStatusCode: `disconnect-${CustomErrorCode.NOT_REGISTERED_USER}`,
      });
    }

    const { affected } = await this.usersService.delete(userId);

    if (Boolean(affected)) {
      return res.status(200).json({ message: 'Disconnection successful' });
    }

    return res.status(401).json({
      message: 'Unsuccessful disconnection',
      internalStatusCode: `disconnect-${CustomErrorCode.UNSUCCESSFUL_DISCONNECTION}`,
    });
  }
}
