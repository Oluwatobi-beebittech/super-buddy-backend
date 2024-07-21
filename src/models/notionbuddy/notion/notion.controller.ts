import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';

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

    return res
      .status(200)
      .json({ message: 'Verified Notion access token', suppliedUserId });
  }

  @Post('/pages')
  async getAllPages(@Request() request, @Res() res) {
    const [, userToken] = request.headers.authorization?.split(' ');

    const { isUserTokenVerified, canvaBrandId, canvaUserId } =
      await this.authService.authoriseUser(userToken);

    if (!isUserTokenVerified) {
      return res
        .status(401)
        .json({ message: 'User is unauthorised to access this resource' });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      canvaUserId,
    });
    if (isRegisteredUser) {
      const { userId, notionAccessToken } =
        await this.usersService.getRegisteredUser({
          canvaUserId,
        });
      return res
        .status(200)
        .json({ userId, hasNotionAccessToken: Boolean(notionAccessToken) });
    }

    const { userId } = await this.usersService.create({
      canvaBrandId,
      canvaUserId,
    });

    return res.status(201).json({ userId, hasNotionAccessToken: false });
  }
}
