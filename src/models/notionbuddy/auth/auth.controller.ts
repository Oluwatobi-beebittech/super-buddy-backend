import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { CustomErrorCode } from 'src/utilities';

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
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        internalStatusCode: `authorise-${CustomErrorCode.USER_TOKEN_VERIFIED}`,
      });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      canvaUserId,
    });
    if (isRegisteredUser) {
      const { userId, notionAccessToken, isNotionAccessTokenValid } =
        await this.usersService.getRegisteredUser({
          canvaUserId,
        });
      return res.status(200).json({
        userId,
        hasNotionAccessToken: Boolean(notionAccessToken),
        isNotionAccessTokenValid,
      });
    }

    const { userId } = await this.usersService.create({
      canvaBrandId,
      canvaUserId,
    });

    return res.status(201).json({
      userId,
      hasNotionAccessToken: false,
      isNotionAccessTokenValid: false,
    });
  }

  @Post('/authorise/proceed')
  async saveDesignId(@Body('userId') userId, @Request() request, @Res() res) {
    const [, designToken] = request.headers.authorization?.split(' ');

    const { designId, isDesignTokenVerified } =
      await this.authService.authoriseDesign(designToken);

    if (!isDesignTokenVerified) {
      return res.status(401).json({
        message: 'Design is unauthorised to access this resource',
        internalStatusCode: `proceed-${CustomErrorCode.DESIGN_TOKEN_VERIFIED}`,
      });
    }

    const isRegisteredUser = await this.usersService.isRegisteredUser({
      userId,
    });

    if (!isRegisteredUser) {
      return res.status(401).json({
        message: 'User is unauthorised to access this resource',
        internalStatusCode: `proceed-${CustomErrorCode.NOT_REGISTERED_USER}`,
      });
    }

    const { affected } = await this.usersService.update(userId, {
      canvaDesignId: designId,
    });

    if (Boolean(affected)) {
      return res.status(200).json({ message: 'Design verified successfully' });
    }

    return res.status(401).json({
      message: 'Unsuccessful design verification',
      internalStatusCode: `proceed-${CustomErrorCode.NO_DESIGN_VERIFICATION}`,
    });
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

    res.status(401).json({
      message: 'User is unauthorised to perform this operation',
      internalStatusCode: `connect-${CustomErrorCode.NOT_REGISTERED_USER}`,
    });
  }

  @Get('/callback')
  async finaliseNotionConnect(@Request() req, @Res() res) {
    const {
      query: { code, error, state: userId },
    } = req;
    const canvaDesignURL: string = 'https://www.canva.com';
    const isRegisteredUser = await this.usersService.isRegisteredUser({
      userId,
    });

    if (!isRegisteredUser) {
      return res.status(302).redirect(canvaDesignURL);
    }

    const { canvaDesignId } = await this.usersService.getRegisteredUser({
      userId,
    });

    const canvaRedirectURL: string = canvaDesignId
      ? `${canvaDesignURL}/design/${canvaDesignId}`
      : canvaDesignURL;

    if (Boolean(error)) {
      return res.status(302).redirect(canvaRedirectURL);
    }

    const {
      access_token: notionAccessToken,
      bot_id: notionBotId,
      workspace_name: notionWorkspaceName,
      workspace_id: notionWorkspaceId,
      workspace_icon: notionWorkspaceIcon,
      owner,
    } = await this.authService.finaliseNotionConnection(code);

    const { affected } = await this.usersService.update(userId, {
      notionAccessToken,
      notionBotId,
      notionWorkspaceName,
      notionWorkspaceId,
      notionWorkspaceIcon,
      notionOwner: JSON.stringify(owner),
      isNotionAccessTokenValid: false,
    });

    if (!Boolean(affected)) {
      res.status(302).redirect(canvaDesignURL);
    }

    return res.status(302).redirect(canvaRedirectURL);
  }
}
