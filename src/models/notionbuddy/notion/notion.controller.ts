import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
} from '@nestjs/common';

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
      return res
        .status(401)
        .json({ message: 'User is unauthorised to access this resource' });
    }
    console.log({ isUserTokenVerified });
    const isRegisteredUser = await this.usersService.isRegisteredUser({
      canvaUserId,
    });

    if (!isRegisteredUser) {
      return res.status(401).json({
        message:
          'User is unauthorised to access this resource. Navigate to connect to notion',
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
      });
    }
    console.log({ isUserTokenVerified, sec: 'ssss' });
    //verify notion access token can return results for page check
    //call service to call notion API
    const { isNotionAccessTokenValid } =
      await this.notionService.verify(notionAccessToken);
    //if successful
    await this.usersService.update(userId, {
      isNotionAccessTokenValid,
    });

    console.log({ isNotionAccessTokenValid });

    if (!isNotionAccessTokenValid) {
      return res
        .status(401)
        .json({ message: 'Unauthorise notion token. Reconnect again' });
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
      return res
        .status(401)
        .json({ message: 'User is unauthorised to access this resource' });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      canvaUserId,
    });
    if (!isRegisteredUser) {
      return res
        .status(401)
        .json({ message: 'User is unauthorised to access this resource' });
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
      return res
        .status(401)
        .json({ message: 'User is unauthorised to access this resource' });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      canvaUserId,
    });
    if (!isRegisteredUser) {
      return res
        .status(401)
        .json({ message: 'User is unauthorised to access this resource' });
    }

    const { notionAccessToken, isNotionAccessTokenValid } =
      await this.usersService.getRegisteredUser({
        canvaUserId,
      });

    if (!isNotionAccessTokenValid) {
      return res
        .status(401)
        .json({ message: 'Unauthorise notion token. Reconnect again' });
    }

    const response = await this.notionService.getPageBlocks(
      notionAccessToken,
      id,
    );

    return res.status(200).json(response);
  }
}
