import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SheetTabsTitleConst } from "../constants/sheet.constant";
import { GoogleDriveService } from '../services/google-drive.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private menuCtrl: MenuController,
    private googleDriveService: GoogleDriveService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.checkForInitialSetup();
  }

  sheetId = "1rvG3W7RcQbYFauuFQESphRCY7zl3x-Wo3likKOXWhiQ";

  checkForInitialSetup(){

  this.googleDriveService.getAllSheetData(this.sheetId);
  this.googleDriveService.getSheetTabData(this.sheetId, SheetTabsTitleConst.GOALS).subscribe();
  



  // const postData = {
  //   "valueInputOption": "USER_ENTERED",
  //   "data": [
  //     {
  //       "range": "Personal_Details!A1:G2",
  //       "majorDimension": "ROWS",
  //       "values": [
  //         [
  //           "first_name",
  //           "last_name",
  //           "email",
  //           "company",
  //           "mobile_number",
  //           "gender",
  //           "birth_year"
  //         ],
  //         [
  //           "F",
  //           "N",
  //           "E",
  //           "F",
  //           "P",
  //           "F",
  //           "B"
  //         ]
  //       ]
  //     },
  //     {
  //       "range": "Goals!A1:A5",
  //       "majorDimension": "COLUMNS",
  //       "values": [
            //  [
            //     "Question", 
            //   "Answer"
            //  ],
  //         [
  //           "The reason I want to sign up for the program is",
  //           "In six months, I will be delighted if",
  //           "My current frequency of physical activity is",
  //           "Briefly describe what you currently do for physical activity"
  //         ]
  //       ]
  //     },
  //     {
  //       "range": "Medical_History!A1:A3",
  //       "majorDimension": "COLUMNS",
  //       "values": [
  //         [
  //           "The last time I had a medical check up was",
  //           "Checked_yes ?",
  //           "Disclaimer Yes?"
  //         ]
  //       ]
  //     }
  //   ]
  // };

  // this.googleDriveService.setAllSheetData(this.sheetId, postData).subscribe();
  }

}
