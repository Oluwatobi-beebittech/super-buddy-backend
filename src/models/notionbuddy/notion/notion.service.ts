import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, lastValueFrom } from 'rxjs';

@Injectable()
export class NotionService {
  private notionSearchURL: string;
  private notionVersion: string;
  private notionBlocks: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.notionSearchURL = this.configService.get<string>('NOTION_SEARCH_URL');
    this.notionVersion = this.configService.get<string>('NOTION_VERSION');
    this.notionBlocks = 'https://api.notion.com/v1/blocks';
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

    try {
      const status = await lastValueFrom(
        this.httpService
          .post(this.notionSearchURL, notionPageSearchPayload, {
            ...this.getHttpHeaders(notionAccessToken),
          })
          .pipe(map((response) => response.status)),
      );

      return { isNotionAccessTokenValid: status === 200 };
    } catch (error) {
      return { isNotionAccessTokenValid: false };
    }
  }

  async getAllPages(notionAccessToken: string): Promise<any> {
    const notionPageSearchPayload = {
      query: '',
      filter: {
        property: 'object',
        value: 'page',
      },
    };

    const response = await lastValueFrom(
      this.httpService
        .post(this.notionSearchURL, notionPageSearchPayload, {
          ...this.getHttpHeaders(notionAccessToken),
        })
        .pipe(map((response) => response.data)),
    );

    return response;
  }

  async getPageBlocks(notionAccessToken: string, pageId: string): Promise<any> {
    const url = `${this.notionBlocks}/${pageId}/children`;
    try {
      const response = await lastValueFrom(
        this.httpService
          .get(url, {
            ...this.getHttpHeaders(notionAccessToken),
          })
          .pipe(map((response) => response.data)),
      );
      return response;
    } catch (error) {
      return { isError: true };
    }
  }
}
