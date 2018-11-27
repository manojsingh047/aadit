import { Injectable } from '@angular/core';
import { EndpointService } from './endpoint.service';
import { SheetTabsTitleConst } from '../constants/sheet.constant';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private enpointService: EndpointService) { }

  public getParsedGetDataUrl(sheetId: string, sheetTitle?: string): string {

    let parsedUrl = this.getUrlWithSheetId(sheetId);

    if (!sheetTitle) {
      parsedUrl += `/values:batchGet?`;
      Object.values(SheetTabsTitleConst).forEach(title => {
        parsedUrl += `ranges=${title}&`;
      });
    } else {
      parsedUrl += `/values/${sheetTitle}?`;
    }

    parsedUrl = this.appendApiKey(parsedUrl);

    return parsedUrl;
  }

  public getParsedPostDataUrl(sheetId: string, sheetTitle?: string): string {

    let parsedUrl = this.getUrlWithSheetId(sheetId);

    if (!sheetTitle) {
      parsedUrl += `/values:batchUpdate`;
    } else {
      parsedUrl += '/values/';
    }

    return parsedUrl;
  }

  public getUrlWithSheetId(sheetId: string) {
    return `${this.enpointService.googleApi}${sheetId}`;
  }

  public appendApiKey(url: string) {
    return `${url}key=${this.enpointService.apiKey}`;
  }

}
