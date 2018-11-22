import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from './app.service';
import { SheetTabsTitleConst } from '../constants/sheet.constant';
import { SheetModel } from '../models/sheet.model';
import { Observable } from 'rxjs';
import { NewSheetModel } from '../models/google-sheet-setup.model';
import { EndpointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  constructor(
    private http: HttpClient,
    private appService: AppService,
    private endpointService: EndpointService) { }

  private allSheetData: SheetModel[] = [];
  public readonly SESSION_STORAGE_KEY: string = "accessToken";

  private getAllSheetDataObj():SheetModel[]{
    return this.allSheetData;
  }

  private isProfileSetupComplete(): boolean {
    const sheetData = this.getAllSheetDataObj();
    console.log(sheetData);

    let isComplete:boolean = false;


  }

  public getAllSheetData(sheetId: string) {
    const url = this.appService.getParsedGetDataUrl(sheetId);
    this.http.get(url).subscribe(
      res => {
        this.saveAllSheetData(res["valueRanges"]);
        this.isProfileSetupComplete();
      },
      err => {
        console.error(err);
      }
    );
  }

  private saveAllSheetData(sheetApidata): void {
    Object.values(SheetTabsTitleConst).forEach((title, index) => {
      let sheetObj: SheetModel = {
        title: "",
        data: {}
      };

      sheetObj.title = title;
      sheetObj.data = sheetApidata[index];

      this.allSheetData.push(sheetObj);
    });
  }
  public getSheetTabData(sheetId: string, tab: string): Observable<any> {
    const url = this.appService.getParsedGetDataUrl(sheetId, tab);
    return this.http.get(url);
  }


  public setAllSheetData(sheetId: string, postData: any): Observable<any> {
    const url = this.appService.getParsedPostDataUrl(sheetId);
    return this.http.post(url, postData)
    // return this.http.post(url, postData, {
    //   headers: new HttpHeaders({
    //     Authorization: `Bearer ya29.Gl1YBoswVibRJqRZfHkWAcRZGbUn7EurbwCsg-tUd3zIpwUI3R78ErdxI0bab4fpZGeeB2Tsv5HIKsmP1-NFNChguAzQGlWDHqNnRAl-5npUtj1j9khEfdS_2PZYrtY`
    //   })
    // });
  }

  public setSheetTabData(sheetId: string, postData: any, tab?: string): Observable<any> {
    const url = this.appService.getParsedPostDataUrl(sheetId);
    return this.http.post(url, postData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ya29.Gl1YBoswVibRJqRZfHkWAcRZGbUn7EurbwCsg-tUd3zIpwUI3R78ErdxI0bab4fpZGeeB2Tsv5HIKsmP1-NFNChguAzQGlWDHqNnRAl-5npUtj1j9khEfdS_2PZYrtY`
      })
    });
  }

  public createUser(user_id, authToken: string): Observable<any> {
    let postData: NewSheetModel = this.getNewSheetModel();
    postData.properties.title = user_id;

    return this.http.post(this.endpointService.googleApi, postData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      })
    });

  }
  public getToken(): string {
    let token: string = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error("no token set , authentication required");
    }
    return token;
  }

  public getNewSheetModel(): NewSheetModel {

    const model = {
      properties: {
        title: ""
      },
      sheets: []
    };

    Object.values(SheetTabsTitleConst).forEach(title => {
      const sheet = {
        properties: {
          title: title
        }
      }
      model.sheets.push(sheet);
    });

    return model;
  }

  public saveUser(user, authToken: string, spreadsheetId: string): Observable<any> {
    const postData = {
      "valueInputOption": "USER_ENTERED",
      "data": [
        {
          "range": "Personal_Details!A1:G2",
          "majorDimension": "ROWS",
          "values": [
            [
              "first_name",
              "last_name",
              "email",
              "company",
              "mobile_number",
              "gender",
              "birth_year"
            ],
            [
              user.first_name,
              user.last_name,
              user.email,
              user.company_id,
              user.phone,
              (user.gender == 'M' ? 'Male' : 'Female'),
              user.birth_year
            ]
          ]
        },
        {
          "range": "Goals!A1:A4",
          "majorDimension": "COLUMNS",
          "values": [
            [
              "The reason I want to sign up for the program is",
              "In six months, I will be delighted if",
              "My current frequency of physical activity is",
              "Briefly describe what you currently do for physical activity"
            ]
          ]
        },
        {
          "range": "Medical_History!A1:A3",
          "majorDimension": "COLUMNS",
          "values": [
            [
              "The last time I had a medical check up was",
              "Checked_yes ?",
              "Disclaimer Yes?"
            ]
          ]
        }
      ]
    };

    return this.http.post('https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheetId + '/values:batchUpdate', postData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      })
    });
  }



}