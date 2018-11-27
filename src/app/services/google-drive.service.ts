import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from './app.service';
import { SheetTabsTitleConst } from '../constants/sheet.constant';
import { SheetModel } from '../models/sheet.model';
import { Observable, Subscriber, Subscription } from 'rxjs';
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

  public isProfileSetupComplete(): boolean {
    const profileData = this.getLocalSheetTabData(SheetTabsTitleConst.SIGN_UP);
    const profileValue = profileData["data"]["values"] || [];

    if (profileValue.length < 2) {
      return false;
    }

    const profileColumnLen = profileValue[0].length;

    if (profileValue[1].length !== profileColumnLen) {      //if enteries are not equal to title enteries
      return false;
    }

    for (const value of profileValue[1]) {
      if (value.length === 0) {
        return false;
      }
    }
    return true;
  }
  public isGoalSetupComplete(): boolean {
    const goalsData = this.getLocalSheetTabData(SheetTabsTitleConst.GOALS);
    const goalsValue = goalsData["data"]["values"] || [];

    if (goalsValue.length < 2) {
      return false;
    }

    const goalsColumnLen = goalsValue[0].length;

    for (let i = 1; i < goalsValue.length; i++) {
      if (goalsValue[i].length !== goalsColumnLen || goalsValue[i][1].length === 0) {
        return false;
      }
    }
    return true;
  }

  public isMedicalSetupComplete(): boolean {
    const medicalData = this.getLocalSheetTabData(SheetTabsTitleConst.MEDICAL_HISTORY);
    const medicalValue = medicalData["data"]["values"] || [];

    if (medicalValue.length < 2) {
      return false;
    }

    const medicalColumnLen = medicalValue[0].length;

    for (let i = 1; i < medicalValue.length; i++) {
      if (medicalValue[i].length !== medicalColumnLen || medicalValue[i][1].length === 0) {
        return false;
      }
    }
    return true;
  }

  public getAllSheetDataObj(): SheetModel[] {
    return this.allSheetData;
  }


  public getLocalSheetTabData(tab: string) {
    const sheetData = this.getAllSheetDataObj();
    return sheetData.find(sheet => sheet.title === tab);
  }

  public getAllSheetData(sheetId: string): Observable<any> {
    const url = this.appService.getParsedGetDataUrl(sheetId);
    return this.http.get(url);
  }

  public saveAllSheetData(sheetApidata): void {
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
    return this.http.post(url, postData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getOauthToken()}`
      })
    });
  }

  public setSheetTabData(sheetId: string, postData: any, tab?: string): Observable<any> {
    const url = this.appService.getParsedPostDataUrl(sheetId);
    return this.http.post(url, postData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getOauthToken()}`
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

  private sheetId = "1vx40aLl8UTvWF-QY1cyh8BA_iXDF0qMw2sxkcg-QQdM";
  private oauthToken = "ya29.GlthBq20kyYUBR1aBl9qGqM2hY6rkpmzaYq00DvVe_5GBtTFTSIjQ5vN5Sz5TteTd0baMwsQP_HKp0ioQWTh-VC-oDSWBhDEjrLrD74K8UvEFmjY20OfaPSNgnXr";
  public getSheetId() {
    return this.sheetId;
  }

  public getOauthToken() {
    return this.oauthToken;
  }


}