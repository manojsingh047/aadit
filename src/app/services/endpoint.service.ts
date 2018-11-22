import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  public readonly googleApi = "https://sheets.googleapis.com/v4/spreadsheets/";
  public readonly apiKey = "AIzaSyAH_W_WMeJSyxFIX1hDJRcrLzV3gPnC9N0";

}
