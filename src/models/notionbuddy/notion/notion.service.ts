import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, lastValueFrom } from 'rxjs';

@Injectable()
export class NotionService {
  private notionSearchURL: string;
  private notionVersion: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.notionSearchURL = this.configService.get<string>('NOTION_SEARCH_URL');
    this.notionVersion = this.configService.get<string>('NOTION_VERSION');
  }

  private getHttpHeaders(notionAccessToken) {
    return {
      headers: {
        Authorization: `Bearer ${notionAccessToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': this.notionVersion,
      },
    };
  }

  async verify(
    notionAccessToken: string,
  ): Promise<{ isNotionAccessTokenValid: boolean }> {
    const notionPageSearchPayload = {
      query: '',
      filter: {
        property: 'object',
        value: 'page',
      },
    };

    const status = await lastValueFrom(
      this.httpService
        .post(this.notionSearchURL, notionPageSearchPayload, {
          ...this.getHttpHeaders(notionAccessToken),
        })
        .pipe(map((response) => response.status)),
    );

    return { isNotionAccessTokenValid: status === 200 };
  }
}
