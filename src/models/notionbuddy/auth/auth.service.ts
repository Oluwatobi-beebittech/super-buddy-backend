import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decode, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { map, lastValueFrom } from 'rxjs';

import {
  VerifyDesignTokenDto,
  VerifyUserTokenDto,
} from './dto/verify-token.dto';

@Injectable()
export class AuthService {
  private notionAuthUrl;
  private notionBuddyAppId;
  private notionOAuthClientId;
  private notionOAuthClientSecret;
  private notionOAuthTokenUrl;
  private notionOAuthRedirectUri;
  private canvaJWKSUrl;
  CACHE_EXPIRY_MS = 60 * 60 * 1_000; // 60 minutes
  TIMEOUT_MS = 30 * 1_000; // 30 seconds

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const authUrl = this.configService.get<string>('NOTION_AUTH_URL');
    const owner = this.configService.get<string>('NOTION_OWNER');
    const responseType = this.configService.get<string>('NOTION_RESPONSE_TYPE');
    const clientId = this.configService.get<string>('NOTION_OAUTH_CLIENT_ID');
    const redirectUri = this.configService.get<string>('NOTION_REDIRECT_URI');

    this.canvaJWKSUrl = this.configService.get<string>('CANVA_JWKS_URL');
    this.notionOAuthTokenUrl = this.configService.get<string>(
      'NOTION_OAUTH_TOKEN_URL',
    );
    this.notionOAuthRedirectUri = redirectUri;
    this.notionOAuthClientId = clientId;
    this.notionOAuthClientSecret = this.configService.get<string>(
      'NOTION_OAUTH_CLIENT_SECRET',
    );
    this.notionBuddyAppId =
      this.configService.get<string>('NOTIONBUDDY_APP_ID');
    this.notionAuthUrl = `${authUrl}?client_id=${clientId}&response_type=${responseType}&owner=${owner}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  private async getActivePublicKey(keyId: string): Promise<string> {
    const jwksUri = `${this.canvaJWKSUrl}/${this.notionBuddyAppId}/jwks`;
    const jwks = new JwksClient({
      cache: true,
      cacheMaxAge: this.CACHE_EXPIRY_MS,
      timeout: this.TIMEOUT_MS,
      rateLimit: true,
      jwksUri,
    });
    const key = await jwks.getSigningKey(keyId);
    return key.getPublicKey();
  }

  private async verifyUserToken(
    userToken: string,
  ): Promise<VerifyUserTokenDto> {
    const { header } = decode(userToken, { complete: true });
    const publicKey = await this.getActivePublicKey(header.kid);

    const { userId, brandId, aud } = verify(userToken, publicKey, {
      audience: this.notionBuddyAppId,
    }) as Record<string, string>;

    return {
      canvaBrandId: brandId,
      canvaUserId: userId,
      isUserTokenVerified: !!userId && !!brandId && !!aud,
    };
  }

  private async verifyDesignToken(
    designToken: string,
  ): Promise<VerifyDesignTokenDto> {
    const { header } = decode(designToken, { complete: true });
    const publicKey = await this.getActivePublicKey(header.kid);

    const { designId, aud } = verify(designToken, publicKey, {
      audience: this.notionBuddyAppId,
    }) as Record<string, string>;

    return {
      designId,
      isDesignTokenVerified: !!aud && !!designId,
    };
  }

  async authoriseUser(userToken: string): Promise<VerifyUserTokenDto> {
    try {
      const verificationInfo = await this.verifyUserToken(userToken);

      if (!verificationInfo.isUserTokenVerified) {
        throw new Error('The user token is not valid');
      }

      return verificationInfo;
    } catch (e) {
      throw new Error('Failed verification');
    }
  }

  async authoriseDesign(designToken: string): Promise<VerifyDesignTokenDto> {
    try {
      const verificationInfo = await this.verifyDesignToken(designToken);

      if (!verificationInfo.isDesignTokenVerified) {
        throw new Error('The design token is not valid');
      }

      return verificationInfo;
    } catch (e) {
      throw new Error('Failed verification');
    }
  }

  getNotionConnectionURL(userId: string): string {
    return `${this.notionAuthUrl}&state=${userId}`;
  }

  private getHttpHeaders() {
    const credentials = Buffer.from(
      `${this.notionOAuthClientId}:${this.notionOAuthClientSecret}`,
    ).toString('base64');

    return {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async finaliseNotionConnection(code: string): Promise<Record<string, any>> {
    const notionTokenPayload = {
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.notionOAuthRedirectUri,
    };
    const response = await lastValueFrom(
      this.httpService
        .post(this.notionOAuthTokenUrl, notionTokenPayload, {
          ...this.getHttpHeaders(),
        })
        .pipe(map((response) => response.data)),
    );

    return response;
  }
}
