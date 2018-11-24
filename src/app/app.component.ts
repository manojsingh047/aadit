import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleDriveService } from './services/google-drive.service';
import { SheetTabsTitleConst } from "./constants/sheet.constant";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private googleDriveService: GoogleDriveService,
    private router: Router,
    private auth: AuthService
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  
    this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/login']);
          }
        },
        () => {
          this.router.navigate(['/login']);
        }
      );
  }
    
  logout() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }
  sheetId = "1rvG3W7RcQbYFauuFQESphRCY7zl3x-Wo3likKOXWhiQ";
  ngOnInit() {
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
