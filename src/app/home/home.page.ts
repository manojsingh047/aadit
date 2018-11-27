import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { SheetTabsTitleConst } from "../constants/sheet.constant";
import { GoogleDriveService } from '../services/google-drive.service';
import { MedicalModal } from '../modals/medical/medical.modal';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private menuCtrl: MenuController,
    private googleDriveService: GoogleDriveService,
    public modalController: ModalController
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.checkForInitialSetup();
  }


  private async showMedicalModal() {
    const modal = await this.modalController.create({
      component: MedicalModal,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }
  checkForInitialSetup() {

    this.googleDriveService.getAllSheetData(this.googleDriveService.getSheetId()).subscribe(
      sheetData => {
        this.googleDriveService.saveAllSheetData(sheetData["valueRanges"]);
        console.log('this.isProfileSetupComplete()', this.googleDriveService.isProfileSetupComplete());
        console.log('this.isGoalSetupComplete()', this.googleDriveService.isGoalSetupComplete());
        console.log('this.isMedicalSetupComplete()', this.googleDriveService.isMedicalSetupComplete());

        this.showMedicalModal();

      },
      err => {
        console.error(err);
      }
    );
    this.googleDriveService.getSheetTabData(this.googleDriveService.getSheetId(), SheetTabsTitleConst.GOALS).subscribe();


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
