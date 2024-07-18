import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller({
  version: '1',
  path: 'notionbuddy/oauth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/authorise')
  async getAuthorisation(@Request() request, @Res() res) {
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
      const { userId } = await this.usersService.getRegisteredUser({
        canvaUserId,
      });
      return res.status(200).json({ userId });
    }

    const { userId } = await this.usersService.create({
      canvaBrandId,
      canvaUserId,
    });

    return res.status(201).json({ userId });
  }

  @Post('/authorise/proceed')
  async saveDesignId(@Body('userId') userId, @Request() request, @Res() res) {
    const [, designToken] = request.headers.authorization?.split(' ');

    const { designId, isDesignTokenVerified } =
      await this.authService.authoriseDesign(designToken);

    if (!isDesignTokenVerified) {
      return res
        .status(401)
        .json({ message: 'Design is unauthorised to access this resource' });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      userId: userId.userId,
    });

    if (!isRegisteredUser) {
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        userId,
      });
    }

    const { affected } = await this.usersService.update(userId, {
      canvaDesignId: designId,
    });

    if (Boolean(affected)) {
      return res.status(200).json({ message: 'Design verified successfully' });
    }

    return res
      .status(401)
      .json({ message: 'Unsuccessful design verification' });
  }

  @Get('/connect')
  async getNotionConnection(@Request() req, @Res() res) {
    const {
      query: { u },
    } = req;

    const isRegisteredUser: boolean = await this.usersService.isRegisteredUser({
      userId: u,
    });

    if (isRegisteredUser) {
      const redirectionURL = this.authService.getNotionConnectionURL(u);

      return res.status(302).redirect(redirectionURL);
    }

    //navigate to superbuddy page to show unauthorised message
    res
      .status(401)
      .json({ message: 'User is unauthorised to perform this operation' });
  }

  @Get('/callback')
  async finaliseNotionConnect(@Request() req, @Res() res) {
    const {
      query: { code, state: userId },
    } = req;
    const canvaDesignURL: string = 'https://www.canva.com';

    const {
      access_token: notionAccessToken,
      bot_id: notionBotId,
      workspace_name: notionWorkspaceName,
      workspace_id: notionWorkspaceId,
      workspace_icon: notionWorkspaceIcon,
      owner,
    } = await this.authService.finaliseNotionConnection(code);
    const isRegisteredUser = await this.usersService.isRegisteredUser({
      userId,
    });

    if (isRegisteredUser) {
      const { affected } = await this.usersService.update(userId, {
        notionAccessToken,
        notionBotId,
        notionWorkspaceName,
        notionWorkspaceId,
        notionWorkspaceIcon,
        notionOwner: JSON.stringify(owner),
      });

      if (!Boolean(affected)) res.status(302).redirect(canvaDesignURL);

      const { canvaDesignId } = await this.usersService.getRegisteredUser({
        userId,
      });
      const canvaRedirectURL: string = canvaDesignId
        ? `${canvaDesignURL}/design/${canvaDesignId}`
        : canvaDesignURL;

      return res.status(302).redirect(canvaRedirectURL);
    }

    return res.status(302).redirect(canvaDesignURL);
  }
}
